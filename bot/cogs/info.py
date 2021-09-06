import json
import sqlite3
from datetime import datetime, timedelta
from platform import python_version
from time import sleep, time

import db
import discord
import requests
from aiohttp.client import request
from apscheduler.triggers.cron import CronTrigger
from discord import Embed
from discord import __version__ as discord_version
from discord.ext import commands
from discord_slash import *
from discord_slash.cog_ext import cog_slash
from dislash import ActionRow, Button, ButtonStyle, InteractionClient
from psutil import Process, virtual_memory

intents = discord.Intents.default()


class InfoCog(commands.Cog, name="meta"):
    """
    This commands shows information.
    """

    def __init__(self, bot):
        self.bot = bot

    @commands.command(help="Returns all the info available for a user")
    async def info(self, ctx, user: discord.Member = None):
        if user is None:
            user = ctx.author
        date_format = "%a, %d %b %Y %I:%M %p"
        ans = db.record(
            f"SELECT user_id, exp, lvl FROM levels WHERE user_id = '{user.id}' and guild_id ='{user.guild.id}'")
        created_at = user.created_at.strftime(date_format)
        embed = discord.Embed(title="INFO", colour=0xFF00FF)
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
        embed.add_field(name="JOINED AT", value=user.joined_at, inline=True)
        embed.add_field(name="REGISTERED",
                        value=user.created_at.strftime(date_format))

        embed.add_field(name="USER CREATED", value=created_at)
        embed.set_thumbnail(url=user.avatar_url)
        embed.set_footer(text='ID: ' + str(user.id))
        await ctx.channel.send(embed=embed)

    @cog_slash(name="info", description="Returns all the info available for a user")
    async def _info(self, ctx: SlashContext, user: discord.Member = None):
        if user is None:
            user = ctx.author
        date_format = "%a, %d %b %Y %I:%M %p"
        ans = db.record(
            f"SELECT user_id, exp, lvl FROM levels WHERE user_id = '{user.id}' and guild_id ='{user.guild.id}'")
        created_at = user.created_at.strftime(date_format)
        embed = discord.Embed(title="INFO", colour=0xFF00FF)
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
        embed.add_field(name="JOINED AT", value=user.joined_at, inline=True)
        embed.add_field(name="REGISTERED",
                        value=user.created_at.strftime(date_format))

        embed.add_field(name="USER CREATED", value=created_at)
        embed.set_thumbnail(url=user.avatar_url)
        embed.set_footer(text='ID: ' + str(user.id))

        await ctx.channel.send(embed=embed)

    @commands.command(help="Returns all the info available for the server")
    async def server(self, ctx):
        result = db.records(
            f"SELECT user_id, exp, lvl from levels WHERE guild_id = '{ctx.author.guild.id}' ORDER BY exp + 0 DESC LIMIT 1")
        for i, x in enumerate(result, 1):
            embed = discord.Embed(colour=0xFF00FF)
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
            if result is not None:
                embed.add_field(
                    name=f"MOST ACTIVE USER", value=f"<@{str(x[0])}> is on level `{str(x[2])}` with `{str(x[1])}` Total XP", inline=False)
            embed.set_thumbnail(url=ctx.guild.icon_url)
            await ctx.send(embed=embed)

    @cog_slash(name="server", description="Returns all the info available for the server")
    async def _server(self, ctx: SlashContext):
        await ctx.defer()
        result = db.records(
            f"SELECT user_id, exp, lvl from levels WHERE guild_id = '{ctx.author.guild.id}' ORDER BY exp + 0 DESC LIMIT 1")
        for i, x in enumerate(result, 1):
            embed = discord.Embed(colour=0xFF00FF)
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

    @cog_slash(name="ping", description="Returns the latency and the response time of the bot")
    async def _ping(self, ctx: SlashContext):
        await ctx.defer()
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

        r = requests.get(f'https://xgnbot.herokuapp.com/status')
        if r.status_code == 200:
            website_status = 'online'
        else:
            website_status = 'offline'

        fields = [
            ("Python version", python_version(), True),
            ("discord.py version", discord_version, True),
            ("Website status", website_status, True),
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

    @cog_slash(name="stats", description="Shows the stats of the bot")
    async def _show_bot_stats(self, ctx: SlashContext):
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

        r = requests.get(f'https://xgnbot.herokuapp.com/api/status')
        if r.status_code == 200:
            website_status = 'online'
        else:
            website_status = 'onffline'

        fields = [
            ("Python version", python_version(), True),
            ("discord.py version", discord_version, True),
            ("Website status", website_status, True),
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
                   url='https://xgnbot.herokuapp.com/'),
            Button(style=ButtonStyle.link, label="Dashboard",
                   url='https://xgnbot.herokuapp.com/dashboard'),
            Button(style=ButtonStyle.link, label="Top.gg",
                   url='https://top.gg/bot/840300480382894080'),
            Button(style=ButtonStyle.link, label="Prime Bots ",
                   url='https://primebots.it/bots/840300480382894080'),
        )

        embed = discord.Embed(title="XGN BOT's links",
                              description="Here you are all the usefull links for XGN BOT",
                              colour=ctx.author.colour)
        embed.set_thumbnail(url=self.bot.user.avatar_url)
        msg = await ctx.send(embed=embed, components=[row])

    @cog_slash(name="about", description="Sends all the urls for the bot")
    async def _about(self, ctx):

        row = ActionRow(
            Button(style=ButtonStyle.link, label="Website",
                   url='https://xgnbot.herokuapp.com/'),
            Button(style=ButtonStyle.link, label="Dashboard",
                   url='https://xgnbot.herokuapp.com/dashboard'),
            Button(style=ButtonStyle.link, label="Top.gg",
                   url='https://top.gg/bot/840300480382894080'),
            Button(style=ButtonStyle.link, label="Prime Bots ",
                   url='https://primebots.it/bots/840300480382894080'),
        )

        embed = discord.Embed(title="XGN BOT's links",
                              description="Here you are all the usefull links for XGN BOT",
                              colour=ctx.author.colour)
        embed.set_thumbnail(url=self.bot.user.avatar_url)
        msg = await ctx.send(embed=embed, components=[row])

    @commands.command(hidden=True)
    @commands.is_owner()
    async def shutdown(self, ctx):
        await ctx.send("OK...")
        db.close()
        exit()


def setup(bot):
    bot.add_cog(InfoCog(bot))
