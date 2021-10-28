import time

import aiohttp
import hikari
import requests
from sanic import Sanic
from sanic.exceptions import InvalidUsage, Unauthorized
from sanic.response import json
from sanic_cors import CORS

import constants
import sql
import utils

try:
    import uvloop

    uvloop.install()
except:
    pass

app = Sanic(__name__)
app.config.FALLBACK_ERROR_FORMAT = "json"

CORS(app)
rest_api = hikari.RESTApp()


@app.route("/oauth/callback", methods=['POST'])
async def callback(request):
    code = request.json.get("code")
    if not code:
        raise InvalidUsage("Invalid request")

    async with aiohttp.ClientSession() as session:
        async with session.post(
            "https://discord.com/api/oauth2/token",
            data={
                "client_id": constants.CLIENT_ID,
                "client_secret": constants.CLIENT_SECRET,
                "grant_type": "authorization_code",
                "code": code,
                "redirect_uri": constants.REDIRECT_URI,
            },
            headers={"Content-Type": "application/x-www-form-urlencoded"},
        ) as resp:
            data = await resp.json()

    token = data.get('access_token')
    if not token:
        raise InvalidUsage("Invalid code")

    return json({'access_token': token})


@app.route("/users/me")
async def get_own_user(request):
    token = request.headers.get("access_token")
    if not token:
        raise Unauthorized("Invalid token!")

    try:
        async with rest_api.acquire(token) as client:
            user = await client.fetch_my_user()
    except hikari.errors.UnauthorizedError:
        raise Unauthorized("Invalid access token")

    return json({
        'id': str(user.id),
        'username': user.username,
        'discriminator': user.discriminator,
        'avatar_url': f"https://cdn.discordapp.com/avatars/{user.id}/{user.avatar_hash}.png?size=512"
    })


@app.route("/guilds")
async def mutual_guilds(request):
    token = request.headers.get("access_token")
    if not token:
        raise Unauthorized("Invalid token!")

    valid_guilds = await utils.get_valid_guilds(token)
    guilds = []
    for i in valid_guilds:
        guild_data = await utils.get_guild_data(i['id'])
        guilds.append({
            "id": str(i['id']),
            "name": str(i['name']),
            "icon_url": str(f"https://cdn.discordapp.com/icons/{i['id']}/{i['icon']}.png?size=512"),
            'in': False if guild_data is None else True
        })
    return json({"guilds": guilds})


@app.route("channels/<guild_id>")
async def channels(request, guild_id):
    text_channels = await utils.get_guild_channels(guild_id)
    return json({"channels": text_channels})


@app.route('/guilds/<guild_id>')
async def guild(request, guild_id):
    guild_info = await utils.get_guild_data(guild_id)
    if not guild_info:
        return json({"error": "Invalid guilds"}, status=400)
    data = {
        'guild_id': guild_id,
    }
    r1 = requests.post(f'{constants.BOT_API_URL}/guilds', json=data)
    jason = r1.json()['guild']
    people = jason['person_count']
    bot_count = jason['bot_count']
    boost = jason['boost']
    tc = jason['text_channels']
    voice_c = jason['voice_channels']
    prefix, welcome_enabled, welcome_channel, welcome_message, leave_enabled, leave_message, leave_channel, level_up_enabled, level_message, level_channel, log_enabled, log_channel = await sql.get_config(guild_id)
    return json({
        "guild_id": guild_id,
        "name": guild_info['name'],
        "icon_url": f"https://cdn.discordapp.com/icons/{guild_id}/{guild_info['icon']}.png",

        "members": people+bot_count,
        "people": people,
        "bot_count": bot_count,
        "boost": boost,
        "text_channels": tc,
        "voice_channels": voice_c,

        "prefix": prefix,

        "welcome_enabled": welcome_enabled,
        "welcome_channel": welcome_channel,
        "welcome_message": welcome_message,
        "leave_enabled": leave_enabled,
        "leave_channel": leave_channel,
        "leave_message": leave_message,
        "level_up_enabled": level_up_enabled,
        "level_message": level_message,
        "level_channel": level_channel,

        "log_enabled": log_enabled,
        "log_channel": log_channel})


@app.route('/leaderboard/<guild_id>')
async def leaderboard(request, guild_id: int):
    guild_info = await utils.get_guild_data(guild_id)
    if not guild_info:
        return json({"error": "Invalid guilds"}, status=400)
    data = {
        'guild_id': guild_id,
    }
    r = requests.post(f'{constants.BOT_API_URL}/leaderboard', json=data)

    return json({
        "name": guild_info['name'],
        'guild_id': guild_id,
        'leaderboard': [{'username': await utils.get_user_info_by_id(i['user']), 'xp': i['exp'], 'lvl': i['lvl'], 'counter': i['counter']} for i in r.json()['leaderboard']],
    })


##ENABLE - DISABLE
@app.route('/api/enablewelcome', methods=["POST"])
async def enable_welcome(request):
    guild_id = request.headers.get('guild_id')
    message = ''
    channel_id = 0
    channel_name = ''

    await sql.welcome_event(
        guild_id, message, int(channel_id), str(channel_name))

    return json({"status": 200})


@app.route('/api/changewelcome', methods=["POST"])
async def change_welcome(request):

    guild_id = request.headers.get('guild_id')

    message = request.headers.get('message')

    channel_id = request.headers.get('channel_id')
    channel_name = utils.get_channel_by_id(guild_id, channel_id)
    await sql.welcome_event(
        guild_id, message, int(channel_id), str(channel_name))

    return json({"status": 200})


@app.route('/api/enableleave', methods=["POST"])
async def enable_leave(request):
    guild_id = request.headers.get('guild_id')
    message = ''
    channel_id = 0
    channel_name = ''

    await sql.leave_event(
        guild_id, message, int(channel_id), str(channel_name))

    return json({"status": 200})


@app.route('/api/changeleave', methods=["POST"])
async def change_leave(request):
    guild_id = request.headers.get('guild_id')
    message = request.headers.get('message')
    channel_id = request.headers.get('channel_id')
    channel_name = utils.get_channel_by_id(guild_id, channel_id)

    await sql.leave_event(
        guild_id, message, int(channel_id), str(channel_name))

    return json({"status": 200})


@app.route('/api/enableleveling', methods=["POST"])
async def enable_leveling(request):
    guild_id = request.headers.get('guild_id')
    message = ''
    channel_id = 0
    channel_name = ''

    await sql.level_system(
        guild_id, message, int(channel_id), str(channel_name))

    return json({"status": 200})


@app.route('/api/changeleveling', methods=["POST"])
async def change_leveling(request):
    guild_id = request.headers.get('guild_id')
    message = request.headers.get('message')
    channel_id = request.headers.get('channel_id')
    channel_name = utils.get_channel_by_id(guild_id, channel_id)

    await sql.level_system(
        guild_id, message, int(channel_id), str(channel_name))

    return json({"status": 200})


@app.route('/api/changeprefix', methods=["POST"])
async def change_prefix(request):

    prefix = request.headers.get('prefix')
    guild_id = request.headers.get('guild_id')

    await sql.change_prefix(prefix, guild_id)

    return json({"status": 200})


@app.route('/api/enablelog', methods=["POST"])
async def enable_log(request):
    guild_id = request.headers.get('guild_id')
    channel_id = 0
    channel_name = ''

    await sql.log_system(
        guild_id, int(channel_id), channel_name)

    return json({"status": 200})


@app.route('/api/changelog', methods=["POST"])
async def change_log(request):
    guild_id = request.headers.get('guild_id')
    channel_id = request.headers.get('channel_id')
    channel_name = utils.get_channel_by_id(guild_id, channel_id)

    await sql.log_system(
        guild_id, int(channel_id), channel_name)

    return json({"status": 200})


@app.route('/api/disable', methods=['POST'])
async def disable(request):
    guild_id = request.headers.get('guild_id')
    action = request.headers.get('action')

    await sql.disable_(guild_id, action)

    return json({"status": 200})


if __name__ == "__main__":
    app.run(debug=True)
