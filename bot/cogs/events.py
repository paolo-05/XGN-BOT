from discord.ext import commands
from requests import get
import discord
import time
import db

from models import GuildConfig, LeaveConfig, WelcomeConfig


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
        for guild in self.bot.guilds:
            try:
                new_config = GuildConfig(id=message.guild.id)
                await new_config.save()
                print(f"{guild} modified")
            except:
                print("all guild modified")

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
                    mention=member.mention, guild=member.guild, members=len(member.guild.members))
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


def setup(bot: commands.Bot):
    bot.add_cog(Events(bot))
