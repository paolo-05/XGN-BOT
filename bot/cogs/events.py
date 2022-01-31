import json
import time

import discord
import requests
from discord.ext import commands
from models import (GuildConfig, LeaveConfig,
                    WelcomeConfig)
from requests import get


async def get_guild_channels(guild_id: int):
    f = open("../data/config.json")
    data = json.load(f)
    token = data["TOKEN"]
    resp = requests.get(
        f"https://discord.com/api/v6/guilds/{guild_id}/channels", headers={"Authorization": f"Bot {token}"}
    )
    channels = []
    for i in resp.json():
        if i['type'] == 0:
            channels.append({
                'id': i['id'],
                'name': i['name'],
                'guild_id': i['guild_id']
            })

    return channels


async def get_channel_by_id(guild_id: int, channel_id: str):
    channels = await get_guild_channels(guild_id)
    for channel in channels:
        if channel['id'] == channel_id:
            channel_name = channel['name']

    return channel_name


class Events(commands.Cog):
    """
    There aren't commands here only event handlers.
    """

    def __init__(self, bot: commands.Bot):
        self.bot = bot

        self._message = "watching !help | {users:,} users in {guilds:,} servers"

    @property
    def message(self):
        return self._message.format(users=len(self.bot.users), guilds=len(self.bot.guilds))

    @message.setter
    def message(self, value):
        if value.split(" ")[0] not in ("playing", "watching", "listening", "streaming"):
            raise ValueError("Invalid activity type.")

        self._message = value

    async def set(self):
        _type, _name = self.message.split(" ", maxsplit=1)
        await self.bot.change_presence(activity=discord.Activity(name=_name, type=getattr(discord.ActivityType, _type, discord.ActivityType.playing)), status=discord.Status.idle)

    @commands.Cog.listener()
    async def on_message(self, message):
        cat = discord.utils.get(
            message.guild.categories,
            name="📶 SERVER STATS")
        if cat is None:
            pass
        else:
            cs = [i for i in cat.channels]
            await cs[0].edit(name=f"👥 Total members: {message.guild.member_count}")
            await cs[1].edit(
                name=f"👨 People: {len([m for m in message.guild.members if not m.bot])}")
            await cs[2].edit(
                name=f"🤖 Bot: {len([m for m in message.guild.members if m.bot])}")
            await cs[3].edit(name=f"📑 Channels: {len(message.guild.channels)}")

        text = "watching /help | {users:,} users in {guilds:,} servers".format(
            users=len(self.bot.users), guilds=len(self.bot.guilds))
        self.message = text
        await self.set()

    @commands.Cog.listener()
    async def on_guild_join(self, guild: discord.Guild):
        new_config = GuildConfig(id=guild.id)
        await new_config.save()

    @commands.Cog.listener()
    async def on_member_join(self, member: discord.Member):
        config = await GuildConfig.filter(id=member.guild.id).get_or_none()
        if not config:
            return

        if config.welcome_enabled == True:
            welcome_config = await WelcomeConfig.filter(
                guild_id=member.guild.id
            ).get_or_none()

            send_channel = discord.utils.get(
                member.guild.channels, id=welcome_config.channel_id)

            username = member.name
            disc = member.discriminator
            guildN = member.guild.name
            mc = len(member.guild.members)
            avatar = member.avatar_url_as(format="png", size=512)

            URL = f'https://some-random-api.ml/welcome/img/7/stars?type=join&username={username}&discriminator={disc}&guildName={guildN}&memberCount={mc}&avatar={avatar}&textcolor=white&key=CEvvlVQ5nEPMsKx7xjZBEbJxc'
            resp = get(URL)
            time.sleep(2)
            if resp.status_code == 200:

                msg = welcome_config.message.format(
                    mention=member.mention, server=member.guild, members=len(member.guild.members))
                await send_channel.send(msg)
                time.sleep(1)
                open('image.png', 'wb').write(resp.content)

                with open('image.png', 'rb') as f:
                    picture = discord.File(f)
                    await send_channel.send(file=picture)
            elif resp.status_code != 200:
                jsonresp = resp.json()

                print(resp.status_code)
                print(jsonresp)

    @commands.Cog.listener()
    async def on_member_remove(self, member: discord.Member):
        config = await GuildConfig.filter(id=member.guild.id).get_or_none()
        if not config:
            return

        if config.leave_enabled == True:
            leave_config = await LeaveConfig.filter(
                guild_id=member.guild.id
            ).get_or_none()

            send_channel = discord.utils.get(
                member.guild.channels, id=leave_config.channel_id)

            username = member.name
            disc = member.discriminator
            guildN = member.guild.name
            mc = len(member.guild.members)
            avatar = member.avatar_url_as(format="png", size=512)

            URL = f'https://some-random-api.ml/welcome/img/7/stars?type=leave&username={username}&discriminator={disc}&guildName={guildN}&memberCount={mc}&avatar={avatar}&textcolor=white&key=CEvvlVQ5nEPMsKx7xjZBEbJxc'
            resp = get(URL)
            time.sleep(2)
            if resp.status_code == 200:

                msg = leave_config.message.format(member.mention)
                await send_channel.send(msg)
                time.sleep(1)
                open('image.png', 'wb').write(resp.content)

                with open('image.png', 'rb') as f:
                    picture = discord.File(f)
                    await send_channel.send(file=picture)
            elif resp.status_code != 200:
                jsonresp = resp.json()

                print(resp.status_code)
                print(jsonresp)

    @commands.Cog.listener()
    async def on_command_error(self, ctx, error):
        try:
            if hasattr(ctx.command, 'on_error'):
                return
            else:
                embed = discord.Embed(
                    title=f":x: Error in {ctx.command}", description=f'`{ctx.command.qualified_name} {ctx.command.signature}`\n{error}', colour=0xFF0000)
                await ctx.send(embed=embed)
        except:
            await ctx.send('command not found')

    @commands.Cog.listener()
    async def on_slash_command_error(self, ctx, error):
        channel = ctx.channel
        embed = discord.Embed(
            title=f"Sorry {ctx.author.name}, there was error in the command: ", description=error, colour=0xFF0000)
        await channel.send(embed=embed)


def setup(bot: commands.Bot):
    bot.add_cog(Events(bot))
