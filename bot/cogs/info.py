from datetime import datetime, timedelta
from platform import python_version
from time import time

import db
import discord
from discord import Embed
from discord.ext import commands
from dislash import (ActionRow, Button, ButtonStyle, Option, OptionType,
                     slash_command)
from models import GuildConfig
from psutil import Process, virtual_memory

__VERSION__ = 'BETA 1.0'


class InfoCog(commands.Cog, name="meta"):
    """
    This commands shows information.
    """

    def __init__(self, bot):
        self.bot = bot
        self.date_format = "%a, %d %b %Y %I:%M %p"

    @commands.command(help="Returns all the info available for a user")
    async def info(self, ctx, user: discord.Member = None):
        if user is None:
            user = ctx.author
        ans = db.record(
            f"SELECT user_id, exp, lvl FROM levels WHERE user_id = '{user.id}' and guild_id ='{user.guild.id}'")
        created_at = user.created_at.strftime(self.date_format)
        embed = discord.Embed(title="INFO", colour=ctx.author.colour)
        embed.add_field(name="NAME", value=user.mention, inline=False)
        if ans is not None:
            xp = int(ans[1])
            lvl = int(ans[2])
            ids = db.column(
                f"SELECT user_id FROM levels WHERE guild_id ='{user.guild.id}' ORDER BY exp DESC")
            rank = (ids.index(user.id)+1)

            embed.add_field(name="XP", value=f"{xp}", inline=True)
            embed.add_field(name="LEVEL", value=f"{lvl}", inline=True)
            embed.add_field(
                name="RANK", value=f"{rank}/{ctx.guild.member_count}", inline=True)

        if len(user.roles) > 1:
            role_string = ' '.join([r.mention for r in user.roles][1:])

            embed.add_field(name="Roles [{}]".format(
                len(user.roles)-1), value=role_string, inline=False)

        perm_string = ', '.join([str(p[0]).replace("_", " ").title()
                                for p in user.guild_permissions if p[1]])

        embed.add_field(name="Guild permissions",
                        value=perm_string, inline=False)

        members = sorted(ctx.guild.members, key=lambda m: m.joined_at)

        embed.add_field(name="Join position", value=str(members.index(user)+1))
        embed.add_field(name="JOINED AT", value=user.joined_at.strftime(
            self.date_format), inline=True)
        embed.add_field(name="REGISTERED",
                        value=user.created_at.strftime(self.date_format))
        embed.set_thumbnail(url=user.avatar_url)
        embed.set_footer(text='ID: ' + str(user.id))
        await ctx.send(embed=embed)

    @commands.command(help="Returns all the info available for the server")
    async def server(self, ctx):
        result = db.records(
            f"SELECT user_id, exp, lvl from levels WHERE guild_id = '{ctx.author.guild.id}' ORDER BY exp + 0 DESC LIMIT 1")
        for i, x in enumerate(result, 1):
            embed = discord.Embed(colour=ctx.author.colour)
            embed.add_field(name="NAME", value=ctx.guild.name, inline=False)
            embed.add_field(
                name="OWNER", value=ctx.guild.owner.name, inline=False)
            embed.add_field(
                name="MEMBERS", value=ctx.guild.member_count, inline=True)
            embed.add_field(
                name="CHANNELS", value=f"Textual ones: {len(ctx.guild.text_channels)}\n Voice ones: {len(ctx.guild.voice_channels)}", inline=True)
            embed.add_field(name="ROLES", value=len(
                ctx.guild.roles), inline=True)
            embed.add_field(
                name="BOOSTS", value=ctx.guild.premium_subscription_count, inline=True)
            embed.add_field(name='Created At', value=ctx.guild.created_at.__format__(
                '%A, %d. %B %Y @ %H:%M:%S'), inline=True)
            if result is not None:
                embed.add_field(
                    name=f"MOST ACTIVE USER", value=f"<@{str(x[0])}> is on level `{str(x[2])}` with `{str(x[1])}` Total XP", inline=False)
            embed.set_thumbnail(url=ctx.guild.icon_url)
            await ctx.send(embed=embed)

    @commands.command(name="ping", help="Returns the latency and the response time of the bot")
    async def ping(self, ctx):
        start = time()
        message = await ctx.send(f"Pong! DWSP latency: {self.bot.latency*1000:,.0f} ms.")
        end = time()
        await message.edit(content=f"Pong! DWSP latency: {self.bot.latency*1000:,.0f} ms. Response time: {(end-start)*1000:,.0f} ms.")

    @commands.command(name="stats", help="Shows the stats of the bot")
    async def show_bot_stats(self, ctx):
        embed = Embed(title="Bot stats",
                      colour=ctx.author.colour,
                      timestamp=datetime.utcnow())

        proc = Process()
        with proc.oneshot():
            uptime = timedelta(seconds=time()-proc.create_time())
            cpu_time = timedelta(
                seconds=(cpu := proc.cpu_times()).system + cpu.user)
            mem_total = virtual_memory().total / (1024**2)
            mem_of_total = proc.memory_percent()
            mem_usage = mem_total * (mem_of_total / 100)

        fields = [
            ("Python version", python_version(), True),
            ("API version", __VERSION__, True),
            ("Website status", 'online', True),
            ("Uptime", uptime, True),
            ("CPU time", cpu_time, True),
            ("Memory usage",
             f"{mem_usage:,.3f} / {mem_total:,.0f} MiB ({mem_of_total:.0f}%)", True),
            ("Users", f"{len(self.bot.users):,}", True)
        ]

        for name, value, inline in fields:
            embed.add_field(name=name, value=value, inline=inline)

        embed.set_thumbnail(url=self.bot.user.avatar_url)

        await ctx.send(embed=embed)

    @commands.command(name="about", help="Sends all the urls for the bot")
    async def about(self, ctx):
        row = ActionRow(
            Button(style=ButtonStyle.link, label="Website",
                   url='https://xgnbot.xyz/'),
            Button(style=ButtonStyle.link, label="Server Dashboard",
                   url='https://xgnbot.xyz/guilds'),
            Button(style=ButtonStyle.link, label="Top.gg",
                   url='https://top.gg/bot/840300480382894080'),
            Button(style=ButtonStyle.link, label="Prime Bots ",
                   url='https://primebots.it/bots/840300480382894080'),
        )

        embed = discord.Embed(title="XGN BOT's links",
                              description="Here you are all the usefull links for XGN BOT",
                              colour=ctx.author.colour)
        embed.set_thumbnail(url=self.bot.user.avatar_url)
        await ctx.send(embed=embed, components=[row])

    @commands.command(hidden=True)
    @commands.is_owner()
    async def shutdown(self, ctx):
        await ctx.send("OK...")
        db.close()
        exit()

    @commands.command(hidden=True)
    @commands.is_owner()
    async def show_bot_stats_(self, ctx, guild_id: int = None):
        if guild_id is None:
            embed = discord.Embed(title='Bot Servers')
            for guild in self.bot.guilds:
                embed.add_field(name=guild.name, value=f"Members: {len(guild.members)}\n"
                                + f"id: {guild.id}", inline=False)
        else:
            config = await GuildConfig.filter(id=guild_id).get_or_none()
            embed = Embed(title=f'Guild {guild_id} information:', description=f"*Plugins*: welcome={True if config.welcome_enabled == True else False}; leave={True if config.leave_enabled == True else False}; levels={True if config.level_up_enabled == True else False}; logs={True if config.log_enabled == True else False};", )
        await ctx.send(embed=embed)

    @slash_command(name="userinfo", description="Returns all the info available for a user", options=[
        Option("user", "mention the user that you want to see infos", OptionType.USER)
    ])
    async def _info(self, inter, user: discord.Member = None):
        if user is None:
            user = inter.author
        ans = db.record(
            f"SELECT user_id, exp, lvl FROM levels WHERE user_id = '{user.id}' and guild_id ='{user.guild.id}'")
        embed = discord.Embed(title="INFO", colour=inter.author.colour)
        embed.add_field(name="NAME", value=user.mention, inline=False)
        if ans is not None:
            xp = int(ans[1])
            lvl = int(ans[2])
            ids = db.column(
                f"SELECT user_id FROM levels WHERE guild_id ='{user.guild.id}' ORDER BY exp DESC")
            rank = (ids.index(user.id)+1)

            embed.add_field(name="XP", value=f"{xp}", inline=True)
            embed.add_field(name="LEVEL", value=f"{lvl}", inline=True)
            embed.add_field(
                name="RANK", value=f"{rank}/{inter.guild.member_count}", inline=True)

        if len(user.roles) > 1:
            role_string = ' '.join([r.mention for r in user.roles][1:])

            embed.add_field(name="Roles [{}]".format(
                len(user.roles)-1), value=role_string, inline=False)

        perm_string = ', '.join([str(p[0]).replace("_", " ").title()
                                for p in user.guild_permissions if p[1]])

        embed.add_field(name="Guild permissions",
                        value=perm_string, inline=False)

        members = sorted(inter.guild.members, key=lambda m: m.joined_at)

        embed.add_field(name="Join position", value=str(members.index(user)+1))
        embed.add_field(name="JOINED AT", value=user.joined_at.strftime(
            self.date_format), inline=True)
        embed.add_field(name="REGISTERED",
                        value=user.created_at.strftime(self.date_format))
        embed.set_thumbnail(url=user.avatar_url)
        embed.set_footer(text='ID: ' + str(user.id))
        await inter.reply(embed=embed)

    @slash_command(name="serverinfo", description="Returns all the info available for the server")
    async def _server(self, inter):
        result = db.records(
            f"SELECT user_id, exp, lvl from levels WHERE guild_id = '{inter.author.guild.id}' ORDER BY exp + 0 DESC LIMIT 1")
        for i, x in enumerate(result, 1):
            embed = discord.Embed(colour=inter.author.colour)
            embed.add_field(name="NAME", value=inter.guild.name, inline=False)
            embed.add_field(
                name="OWNER", value=inter.guild.owner.name, inline=False)
            embed.add_field(
                name="MEMBERS", value=inter.guild.member_count, inline=True)
            embed.add_field(
                name="CHANNELS", value=f"Textual ones: {len(inter.guild.text_channels)}\n Voice ones: {len(inter.guild.voice_channels)}", inline=True)
            embed.add_field(name="ROLES", value=len(
                inter.guild.roles), inline=True)
            embed.add_field(
                name="BOOSTS", value=inter.guild.premium_subscription_count, inline=True)
            embed.add_field(name='CREATED AT', value=inter.guild.created_at.__format__(
                '%A, %d. %B %Y @ %H:%M:%S'), inline=True)
            if result is not None:
                embed.add_field(
                    name=f"MOST ACTIVE USER", value=f"<@{str(x[0])}> is on level `{str(x[2])}` with `{str(x[1])}` Total XP", inline=False)
            embed.set_thumbnail(url=inter.guild.icon_url)
            await inter.reply(embed=embed)

    @slash_command(name="ping", description="Returns the latency and the response time of the bot")
    async def _ping(self, inter):
        start = time()
        message = await inter.reply(f"Pong! DWSP latency: {self.bot.latency*1000:,.0f} ms.")
        end = time()
        await message.edit(content=f"Pong! DWSP latency: {self.bot.latency*1000:,.0f} ms. Response time: {(end-start)*1000:,.0f} ms.")

    @slash_command(name="stats", description="Shows the stats of the bot")
    async def _show_bot_stats(self, inter):
        embed = Embed(title="Bot stats",
                      colour=inter.author.colour,
                      timestamp=datetime.utcnow())

        proc = Process()
        with proc.oneshot():
            uptime = timedelta(seconds=time()-proc.create_time())
            cpu_time = timedelta(
                seconds=(cpu := proc.cpu_times()).system + cpu.user)
            mem_total = virtual_memory().total / (1024**2)
            mem_of_total = proc.memory_percent()
            mem_usage = mem_total * (mem_of_total / 100)

        fields = [
            ("Python version", python_version(), True),
            ("API version", __VERSION__, True),
            ("Website status", 'online', True),
            ("Uptime", uptime, True),
            ("CPU time", cpu_time, True),
            ("Memory usage",
             f"{mem_usage:,.3f} / {mem_total:,.0f} MiB ({mem_of_total:.0f}%)", True),
            ("Users", f"{len(self.bot.users):,}", True)
        ]

        for name, value, inline in fields:
            embed.add_field(name=name, value=value, inline=inline)

        embed.set_thumbnail(url=self.bot.user.avatar_url)

        await inter.reply(embed=embed)

    @slash_command(name="about", description="Sends all the urls for the bot")
    async def _about(self, inter):
        row = ActionRow(
            Button(style=ButtonStyle.link, label="Website",
                   url='https://xgnbot.xyz/'),
            Button(style=ButtonStyle.link, label="Server Dashboard",
                   url='https://xgnbot.xyz/guilds'),
            Button(style=ButtonStyle.link, label="Top.gg",
                   url='https://top.gg/bot/840300480382894080'),
            Button(style=ButtonStyle.link, label="Prime Bots ",
                   url='https://primebots.it/bots/840300480382894080'),
        )

        embed = discord.Embed(title="XGN BOT's links",
                              description="Here you are all the usefull links for XGN BOT",
                              colour=inter.author.colour)
        embed.set_thumbnail(url=self.bot.user.avatar_url)
        await inter.reply(embed=embed, components=[row])


def setup(bot):
    bot.add_cog(InfoCog(bot))
