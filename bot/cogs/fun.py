import io
from random import choice

import aiohttp
import discord
from aiohttp import request
from discord import Embed
from discord.ext import commands
from discord.ext.commands import (BucketType, Cog,
                                  cooldown)
from dislash import (Option, OptionType,
                     slash_command)


class FunCog(Cog, name="fun"):
    """
    This commands can be used to get fun.
    """

    def __init__(self, bot):
        self.bot = bot

    @commands.command(name="hello", aliases=["hi"], help="Say hello")
    async def say_hello(self, ctx):
        await ctx.send(f"{choice(('Hello', 'Hi', 'Hey', 'Hiya'))} {ctx.author.mention}!")

    @commands.command(name="tweet", help="sends a faked tweet with a message")
    async def tweet(self, ctx, *, message):
        username = ctx.author.name
        avatar = ctx.author.avatar_url_as(format="png", size=512)

        async with aiohttp.ClientSession() as s:
            async with s.get(f"https://some-random-api.ml/canvas/tweet?username={username}&displayname={username}&avatar={avatar}&comment={message}") as gayImg:
                imageData = io.BytesIO(await gayImg.read())
                await s.close()

                await ctx.send(file=discord.File(imageData, 'tweet.png'))

    @commands.command(name="echo", aliases=["say"], help="Repeat a message")
    @cooldown(1, 15, BucketType.guild)
    async def echo_message(self, ctx, *, message):
        message = message or "Please say something to use the say command!"
        message_components = message.split()
        if "@everyone" in message_components or "@here" in message_components:
            await ctx.send("You cannot have `@everyone` or `@here` in your message!")
            return
        await ctx.message.delete()
        await ctx.send(message)

    @commands.command(name="meme", help="Sends a random meme")
    @cooldown(3, 60, BucketType.guild)
    async def meme(self, ctx):
        image = f"https://some-random-api.ml/meme"
        async with request("GET", image, headers={}) as response:
            if response.status == 200:
                data = await response.json()
                image_link = data["image"]
                data = await response.json()
                embed = Embed(title=data["caption"],
                              colour=ctx.author.colour)
                if image_link is not None:
                    embed.set_image(url=image_link)
                    embed.set_footer(text=data["category"])
                await ctx.send(embed=embed)
            else:
                await ctx.send(f"API returned a {response.status} status.")

    @commands.command(name="token", help="Returns a 100%" + " real discord token")
    @cooldown(3, 60, BucketType.guild)
    async def app_token(self, ctx):

        token = f"https://some-random-api.ml/bottoken"

        async with request("GET", token, headers={}) as response:
            if response.status == 200:
                data = await response.json()
                token_link = data["token"]

                embed = Embed(title=f"here you are the 100%" + " real token of this bot", description=token_link,
                              colour=ctx.author.colour)
                await ctx.send(embed=embed)

            else:
                await ctx.send(f"API returned a {response.status} status.")

    @commands.command(name="fact", help="Sends a fact about an animal")
    @cooldown(3, 60, BucketType.guild)
    async def animal_fact(self, ctx, animal: str):
        if (animal := animal.lower()) in ("dog", "cat", "panda", "fox", "bird", "koala"):
            fact_url = f"https://some-random-api.ml/facts/{animal}"
            image_url = f"https://some-random-api.ml/img/{'birb' if animal == 'bird' else animal}"

            async with request("GET", image_url, headers={}) as response:
                if response.status == 200:
                    data = await response.json()
                    image_link = data["link"]

                else:
                    image_link = None

            async with request("GET", fact_url, headers={}) as response:
                if response.status == 200:
                    data = await response.json()

                    embed = Embed(title=f"{animal.title()} fact",
                                  description=data["fact"],
                                  colour=ctx.author.colour)
                    if image_link is not None:
                        embed.set_image(url=image_link)
                    await ctx.send(embed=embed)

                else:
                    await ctx.send(f"API returned a {response.status} status.")
        else:
            await ctx.send("No facts are available for that animal.")

    @slash_command(name="hello", description="Say hello")
    async def _say_hello(self, ctx):
        await ctx.send(f"{choice(('Hello', 'Hi', 'Hey', 'Hiya'))} {ctx.author.mention}!")

    @slash_command(name="tweet", description="sends a faked tweet with a message", options=[Option("message", "set the message that will appear as tweet", OptionType.STRING)])
    async def _tweet(self, ctx, *, message):
        username = ctx.author.name
        avatar = ctx.author.avatar_url_as(format="png", size=512)

        async with aiohttp.ClientSession() as s:
            async with s.get(f"https://some-random-api.ml/canvas/tweet?username={username}&displayname={username}&avatar={avatar}&comment={message}") as gayImg:
                imageData = io.BytesIO(await gayImg.read())
                await s.close()

                await ctx.send(file=discord.File(imageData, 'tweet.png'))

    @slash_command(name="meme", description="Sends a random meme")
    async def _meme(self, ctx):
        image = f"https://some-random-api.ml/meme"
        async with request("GET", image, headers={}) as response:
            if response.status == 200:
                data = await response.json()
                image_link = data["image"]
                data = await response.json()
                embed = Embed(title=data["caption"],
                              colour=ctx.author.colour)
                if image_link is not None:
                    embed.set_image(url=image_link)
                    embed.set_footer(text=data["category"])
                await ctx.send(embed=embed)
            else:
                await ctx.send(f"API returned a {response.status} status.")

    @slash_command(name="token", description="Returns a 100%" + " real discord token")
    async def _app_token(self, ctx):

        token = f"https://some-random-api.ml/bottoken"

        async with request("GET", token, headers={}) as response:
            if response.status == 200:
                data = await response.json()
                token_link = data["token"]

                embed = Embed(title=f"here you are the 100%" + " real token of this bot", description=token_link,
                              colour=ctx.author.colour)
                await ctx.send(embed=embed)

            else:
                await ctx.send(f"API returned a {response.status} status.")

    @slash_command(name="fact", description="Sends a fact about an animal", options=[
        Option("animal", "dog/cat/panda/fox/bird/koala",
               OptionType.STRING, required=True)
    ])
    async def _animal_fact(self, ctx, animal: str):
        if (animal := animal.lower()) in ("dog", "cat", "panda", "fox", "bird", "koala"):
            fact_url = f"https://some-random-api.ml/facts/{animal}"
            image_url = f"https://some-random-api.ml/img/{'birb' if animal == 'bird' else animal}"

            async with request("GET", image_url, headers={}) as response:
                if response.status == 200:
                    data = await response.json()
                    image_link = data["link"]

                else:
                    image_link = None

            async with request("GET", fact_url, headers={}) as response:
                if response.status == 200:
                    data = await response.json()

                    embed = Embed(title=f"{animal.title()} fact",
                                  description=data["fact"],
                                  colour=ctx.author.colour)
                    if image_link is not None:
                        embed.set_image(url=image_link)
                    await ctx.send(embed=embed)

                else:
                    await ctx.send(f"API returned a {response.status} status.")
        else:
            await ctx.send("No facts are available for that animal.")


def setup(bot):
    bot.add_cog(FunCog(bot))
