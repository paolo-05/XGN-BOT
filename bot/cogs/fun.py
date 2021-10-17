from random import choice

from aiohttp import request
from discord import Embed, Member
from discord.ext import commands
from discord.ext.commands import (BadArgument, BucketType, Cog,
                                  MissingRequiredArgument, cooldown)
from discord_slash.cog_ext import cog_slash


class FunCog(Cog, name="fun"):
    """
    This commands can be used to get fun.
    """

    def __init__(self, bot):
        self.bot = bot

    @commands.command(name="hello", aliases=["hi"], help="Say hello")
    async def say_hello(self, ctx):
        await ctx.send(f"{choice(('Hello', 'Hi', 'Hey', 'Hiya'))} {ctx.author.mention}!")

    @cog_slash(name="hello", description="Say hello")
    async def _say_hello(self, ctx):
        await ctx.send(f"{choice(('Hello', 'Hi', 'Hey', 'Hiya'))} {ctx.author.mention}!")

    @commands.command(name="slap", aliases=["hit"], help="Slap an user")
    async def slap_member(self, ctx, member: Member, *, reason: str):
        if reason == None:
            reason = "none"
        await ctx.send(f"{ctx.author.display_name} slapped {member.mention} {reason}!")

    @cog_slash(name="slap", description="Slap an user")
    async def _slap_member(self, ctx, member: Member, *, reason: str):
        if reason == None:
            reason = "none"
        await ctx.send(f"{ctx.author.display_name} slapped {member.mention} {reason}!")

    @slap_member.error
    async def slap_member_error(self, ctx, exc):
        if isinstance(exc, MissingRequiredArgument):
            await ctx.send('Please add all the required args: `!slap <user> <reason>`')
        if isinstance(exc, BadArgument):
            await ctx.send("I can't find that member.")

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

                embed = Embed(title=f"there's your meme",
                              colour=ctx.author.colour)
                if image_link is not None:
                    embed.set_image(url=image_link)
                await ctx.send(embed=embed)

            else:
                await ctx.send(f"API returned a {response.status} status.")

    @cog_slash(name="meme", description="Sends a random meme")
    async def _meme(self, ctx):

        image = f"https://some-random-api.ml/meme"

        async with request("GET", image, headers={}) as response:
            if response.status == 200:
                data = await response.json()
                image_link = data["image"]

                data = await response.json()

                embed = Embed(title=f"there's your meme",
                              colour=ctx.author.colour)
                if image_link is not None:
                    embed.set_image(url=image_link)
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

    @cog_slash(name="token", description="Returns a 100%" + " real discord token")
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

    @cog_slash(name="fact", description="Sends a fact about an animal")
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
