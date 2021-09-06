import discord
from aiohttp import ClientSession
from discord.ext import commands
from requests import get

from discord_slash import *
from discord_slash.cog_ext import cog_slash

with open('../data/rapidapi_key.txt', 'r', encoding='utf-8') as f:
    key = f.readline()


class Dictionary(commands.Cog, name="dictionary"):
    """
    This command send a dictionary for a given word.
    """

    def __init__(self, bot):
        self.bot = bot

    @commands.command(help="Returns an explanation of the term of your choice")
    @commands.is_nsfw()
    async def urban(self, ctx, *, args):
        badwords = get(
            f'https://raw.githubusercontent.com/LDNOOBW/List-of-Dirty-Naughty-Obscene-and-Otherwise-Bad-Words'
            f'/master/en').text.split("\n")
        term = ''.join(args)
        url = "https://mashape-community-urban-dictionary.p.rapidapi.com/define"
        querystring = {"term": term}

        headers = {
            'x-rapidapi-key': f"{key}",
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

    @cog_slash(name="urban", description="Returns an explanation of the term of your choice")
    async def _urban(self, ctx: SlashContext, query: str):
        if ctx.channel.is_nsfw():
            badwords = get(
                f'https://raw.githubusercontent.com/LDNOOBW/List-of-Dirty-Naughty-Obscene-and-Otherwise-Bad-Words'
                f'/master/en').text.split("\n")
            term = ''.join(query)
            url = "https://mashape-community-urban-dictionary.p.rapidapi.com/define"
            querystring = {"term": term}

            headers = {
                'x-rapidapi-key': f"{key}",
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
                    embed.add_field(name="EXAMPLES",
                                    value=example, inline=False)
                    embed.add_field(
                        name=f":thumbsup: : {thumbs_up}", value="Likes", inline=False)
                    embed.add_field(
                        name=f":thumbsdown: {thumbs_down}", value="Dislikes", inline=False)

                    await ctx.send(embed=embed)
        else:
            await ctx.send("You need to use this command in a nsfw channel!")


def setup(bot):
    bot.add_cog(Dictionary(bot))
