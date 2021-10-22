import json
import discord
from aiohttp import ClientSession
from discord.ext import commands
from requests import get

from discord_slash import *
from discord_slash.cog_ext import cog_slash


class Dictionary(commands.Cog, name="dictionary"):
    """
    This command send a dictionary for a given word.
    """

    def __init__(self, bot):
        self.bot = bot
        f = open("../data/config.json")
        data = json.load(f)
        self.key = data["RAPID_API_KEY"]

    @commands.command(help="Returns an explanation of the term of your choice")
    @commands.is_nsfw()
    async def urban(self, ctx, *, args):
        term = ''.join(args)
        url = "https://mashape-community-urban-dictionary.p.rapidapi.com/define"
        querystring = {"term": term}

        headers = {
            'x-rapidapi-key': f"{self.key}",
            'x-rapidapi-host': "mashape-community-urban-dictionary.p.rapidapi.com"
        }

        async with ClientSession() as session:
            async with session.get(url, headers=headers, params=querystring) as response:
                r = await response.json()
                definition = r['list'][0]['definition']
                example = r['list'][0]['example']
                thumbs_up = r['list'][0]['thumbs_up']
                thumbs_down = r['list'][0]['thumbs_down']
                embed = discord.Embed(
                    title=f"First result for: {term}", colour=ctx.author.color)
                embed.add_field(name="DEFINITION",
                                value=definition, inline=False)
                embed.add_field(name="EXAMPLES", value=example, inline=False)
                embed.add_field(
                    name=f":thumbsup: : {thumbs_up}", value="Likes", inline=False)
                embed.add_field(
                    name=f":thumbsdown: {thumbs_down}", value="Dislikes", inline=False)

                await ctx.send(embed=embed)


def setup(bot):
    bot.add_cog(Dictionary(bot))
