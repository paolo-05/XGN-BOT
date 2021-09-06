import io
from os import getcwd
from random import choice, randint
from typing import Optional

import aiohttp
import discord
from aiohttp import request
from discord import Embed, Member
from discord.ext import commands
from discord.ext.commands import BadArgument, BucketType, Cog, cooldown
from requests import get

from discord_slash import *
from discord_slash.cog_ext import cog_slash


class Fun_ov_Cog(Cog, name="fun_images"):
    """
    This commands can be used to create fun images.
    """

    def __init__(self, bot):
        self.bot = bot

    @commands.command(help="Creates an image with the LGBTQI+XSXWWSD overlay")
    @cooldown(3, 60, BucketType.guild)
    async def gay(self, ctx, member: discord.Member = None):
        if not member:
            member = ctx.author

        async with aiohttp.ClientSession() as gaySession:
            async with gaySession.get(f'https://some-random-api.ml/canvas/gay?avatar={member.avatar_url_as(static_format="png", size=1024)}') as gayImg:
                imageData = io.BytesIO(await gayImg.read())

                await gaySession.close()

                await ctx.send(file=discord.File(imageData, 'gay.gif'))

    @cog_slash(name="gay", description="Creates an image with the LGBTQI+XSXWWSD overlay")
    async def _gay(self, ctx: SlashContext, member: discord.Member = None):
        if not member:
            member = ctx.author

        async with aiohttp.ClientSession() as gaySession:
            async with gaySession.get(f'https://some-random-api.ml/canvas/gay?avatar={member.avatar_url_as(static_format="png", size=1024)}') as gayImg:
                imageData = io.BytesIO(await gayImg.read())

                await gaySession.close()

                await ctx.send(file=discord.File(imageData, 'gay.gif'))

    @commands.command(help="Creates an image with the GTA wasted overlay")
    @cooldown(3, 60, BucketType.guild)
    async def wasted(self, ctx, member: discord.Member = None):
        if not member:
            member = ctx.author

        async with aiohttp.ClientSession() as wastSession:
            async with wastSession.get(f'https://some-random-api.ml/canvas/wasted?avatar={member.avatar_url_as(static_format="png", size=1024)}') as wastImg:
                imageData = io.BytesIO(await wastImg.read())

                await wastSession.close()

                await ctx.send(file=discord.File(imageData, 'wasted.gif'))

    @cog_slash(name="wasted", description="Creates an image with the GTA wasted overlay")
    async def _wasted(self, ctx: SlashContext, member: discord.Member = None):
        if not member:
            member = ctx.author

        async with aiohttp.ClientSession() as wastSession:
            async with wastSession.get(f'https://some-random-api.ml/canvas/wasted?avatar={member.avatar_url_as(static_format="png", size=1024)}') as wastImg:
                imageData = io.BytesIO(await wastImg.read())

                await wastSession.close()

                await ctx.send(file=discord.File(imageData, 'wasted.gif'))

    @commands.command(help="Creates an image with a jail")
    @cooldown(3, 60, BucketType.guild)
    async def capture(self, ctx, member: discord.Member = None):
        if not member:
            member = ctx.author

        async with aiohttp.ClientSession() as jailSession:
            async with jailSession.get(f'https://some-random-api.ml/canvas/jail?avatar={member.avatar_url_as(static_format="png", size=1024)}') as jailImg:
                imageData = io.BytesIO(await jailImg.read())

                await jailSession.close()

                await ctx.send(file=discord.File(imageData, 'jail.gif'))

    @cog_slash(name='capture', description="Creates an image with a jail")
    async def _capture(self, ctx: SlashContext, member: discord.Member = None):
        if not member:
            member = ctx.author

        async with aiohttp.ClientSession() as jailSession:
            async with jailSession.get(f'https://some-random-api.ml/canvas/jail?avatar={member.avatar_url_as(static_format="png", size=1024)}') as jailImg:
                imageData = io.BytesIO(await jailImg.read())

                await jailSession.close()

                await ctx.send(file=discord.File(imageData, 'jail.gif'))

    @commands.command(help="Creates a gif with the triggered overlay")
    @cooldown(3, 60, BucketType.guild)
    async def triggered(self, ctx, member: discord.Member = None):
        if not member:
            member = ctx.author

        async with aiohttp.ClientSession() as trigSession:
            async with trigSession.get(f'https://some-random-api.ml/canvas/triggered?avatar={member.avatar_url_as(static_format="png", size=1024)}') as trigImg:
                imageData = io.BytesIO(await trigImg.read())

                await trigSession.close()

                await ctx.send(file=discord.File(imageData, 'triggered.gif'))

    @cog_slash(name='triggered', description="Creates a gif with the triggered overlay")
    async def _triggered(self, ctx: SlashContext, member: discord.Member = None):
        if not member:
            member = ctx.author

        async with aiohttp.ClientSession() as trigSession:
            async with trigSession.get(f'https://some-random-api.ml/canvas/triggered?avatar={member.avatar_url_as(static_format="png", size=1024)}') as trigImg:
                imageData = io.BytesIO(await trigImg.read())

                await trigSession.close()

                await ctx.send(file=discord.File(imageData, 'triggered.gif'))


def setup(bot):
    bot.add_cog(Fun_ov_Cog(bot))
