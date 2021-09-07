import json
import aiohttp_cors
import discord
from aiohttp import web
from discord.ext import commands

import db

from models import GuildConfig, LeaveConfig, LogChannel, WelcomeConfig, LevelUpConfig

PATH = '../data/warns.json'

with open(PATH, encoding='utf-8') as f:
    try:
        report = json.load(f)
    except ValueError:
        report = {}
        report['users'] = []


class Server(commands.Cog):
    """
    The super scecret bot API used for the making up of the [website](https://xgnbot.herokuapp.com/)
    """

    def __init__(self, bot: commands.Bot):
        self.bot = bot
        self.site = None

    async def get_status(self, request):
        return web.json_response({"guilds": len(self.bot.guilds), "ping": round(self.bot.latency * 1000), "users": len(self.bot.users)})

    async def get_guild_data(self, request):
        json_data = await request.json()
        guild_id = json_data.get("guild_id")
        if not guild_id:
            return web.json_response({"error": "Invalid guild"}, status=400)

        guild: discord.Guild = self.bot.get_guild(int(guild_id))

        person_count = len([m for m in guild.members if not m.bot])
        bot_count = len([m for m in guild.members if m.bot])
        boost = guild.premium_subscription_count
        text_channels = len(guild.text_channels)
        voice_channels = len(guild.voice_channels)

        info = {
            'person_count': person_count,
            'bot_count': bot_count,
            'boost': boost,
            'text_channels': text_channels,
            'voice_channels': voice_channels,
        }

        return web.json_response({"guild": info}, status=200)

    async def get_guild_leaderboard(self, request):
        json_data = await request.json()
        guild_id = json_data.get("guild_id")
        if not guild_id:
            return web.json_response({"error": "Invalid guild"}, status=400)

        records = db.records(
            f"SELECT user_id, exp, lvl FROM levels WHERE guild_id = '{guild_id}' ORDER BY exp DESC")

        leaderboard = {}

        for record in records:
            leaderboard.append({
                'user': records[0],
                'exp': records[1],
                'lvl': records[2]
            })

        return web.json_response({"leaderboard": leaderboard}, status=200)

    async def start_server(self):
        app = web.Application()
        cors = aiohttp_cors.setup(app)

        cors.add(
            cors.add(app.router.add_resource("/status")).add_route("GET", self.get_status), {
                "*": aiohttp_cors.ResourceOptions(
                    allow_credentials=True,
                    expose_headers="*",
                    allow_headers="*"
                )
            })

        cors.add(
            cors.add(app.router.add_resource("/guilds")).add_route("POST", self.get_guild_data), {
                "*": aiohttp_cors.ResourceOptions(
                    allow_credentials=True,
                    expose_headers="*",
                    allow_headers="*"
                )
            })
        cors.add(
            cors.add(app.router.add_resource("/leaderboard")).add_route("POST", self.get_guild_leaderboard), {
                "*": aiohttp_cors.ResourceOptions(
                    allow_credentials=True,
                    expose_headers="*",
                    allow_headers="*"
                )
            })

        runner = web.AppRunner(app)
        await runner.setup()

        self.api = web.TCPSite(runner, '0.0.0.0', 6969)

        await self.bot.wait_until_ready()
        await self.api.start()
        print("Server has been started")


def setup(bot: commands.Bot):
    cog = Server(bot)
    bot.add_cog(cog)
    bot.loop.create_task(cog.start_server())
