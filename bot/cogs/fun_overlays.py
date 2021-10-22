import io

import aiohttp
import discord
import dislash
from discord.ext import commands
from discord.ext.commands import BucketType, Cog, cooldown
from dislash import (ActionRow, Button, ButtonStyle, Option, OptionType,
                     slash_command)


class FunOverlaysCog(Cog, name="fun_images"):
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

    @slash_command(name="gay", description="Creates an image with the LGBTQI+XSXWWSD overlay", options=[
        Option("user", "mention the user that you want to see infos", OptionType.USER)
    ])
    @dislash.cooldown(3, 60, BucketType.guild)
    async def _gay(self, ctx, user: discord.Member = None):
        if not user:
            user = ctx.author

        async with aiohttp.ClientSession() as gaySession:
            async with gaySession.get(f'https://some-random-api.ml/canvas/gay?avatar={user.avatar_url_as(static_format="png", size=1024)}') as gayImg:
                imageData = io.BytesIO(await gayImg.read())

                await gaySession.close()

                await ctx.send(file=discord.File(imageData, 'gay.gif'))

    @slash_command(help="Creates an image with the GTA wasted overlay", options=[
        Option("user", "mention the user for the image", OptionType.USER)
    ])
    @dislash.cooldown(3, 60, BucketType.guild)
    async def wasted(self, ctx, user: discord.Member = None):
        if not user:
            user = ctx.author

        async with aiohttp.ClientSession() as wastSession:
            async with wastSession.get(f'https://some-random-api.ml/canvas/wasted?avatar={user.avatar_url_as(static_format="png", size=1024)}') as wastImg:
                imageData = io.BytesIO(await wastImg.read())

                await wastSession.close()

                await ctx.send(file=discord.File(imageData, 'wasted.gif'))

    @slash_command(name="capture", description="Creates an image with a jail", options=[
        Option("user", "mention the user for the image", OptionType.USER)
    ])
    @dislash.cooldown(3, 60, BucketType.guild)
    async def _capture(self, ctx, user: discord.Member = None):
        if not user:
            user = ctx.author

        async with aiohttp.ClientSession() as jailSession:
            async with jailSession.get(f'https://some-random-api.ml/canvas/jail?avatar={user.avatar_url_as(static_format="png", size=1024)}') as jailImg:
                imageData = io.BytesIO(await jailImg.read())

                await jailSession.close()

                await ctx.send(file=discord.File(imageData, 'jail.gif'))

    @slash_command(name="triggered", description="Creates a gif with the triggered overlay", options=[
        Option("user", "mention the user for the image", OptionType.USER)
    ])
    @dislash.cooldown(3, 60, BucketType.guild)
    async def _triggered(self, ctx, user: discord.Member = None):
        if not user:
            user = ctx.author

        async with aiohttp.ClientSession() as trigSession:
            async with trigSession.get(f'https://some-random-api.ml/canvas/triggered?avatar={user.avatar_url_as(static_format="png", size=1024)}') as trigImg:
                imageData = io.BytesIO(await trigImg.read())

                await trigSession.close()

                await ctx.send(file=discord.File(imageData, 'triggered.gif'))


def setup(bot):
    bot.add_cog(FunOverlaysCog(bot))
