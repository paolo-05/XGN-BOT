import datetime
import json

import discord
from discord.ext import commands
from discord.ext.commands import has_permissions
from dislash import (ActionRow, Button, ButtonStyle, Option, OptionType,
                     slash_command)
import dislash

intents = discord.Intents.default()


PATH = '../data/warns.json'

with open(PATH, encoding='utf-8') as f:
    try:
        report = json.load(f)
    except ValueError:
        report = {}
        report['users'] = []


class ModCog(commands.Cog, name="moderation"):
    """
    Mod commands that require at leat an admin role.
    """

    def __init__(self, bot):
        self.bot = bot

    @commands.command(help="Delete messages")
    @has_permissions(manage_roles=True, ban_members=True)
    async def purge(self, ctx, number: int = None):
        try:
            if number is None:
                await ctx.send("Insert a number!")
            else:
                deleted = await ctx.message.channel.purge(limit=number)
                await ctx.send(f"Message deleted by {ctx.author.mention}: {len(deleted)}.")
        except:
            await ctx.send("There was an error deleting")

    @commands.command(name="warn", help="Warn an user")
    @has_permissions(manage_roles=True, kick_members=True)
    async def warn(self, ctx, user: discord.Member, *reason: str):
        if not reason:
            await ctx.send("Please provide a reason")
            return
        await ctx.send("user warned.")
        reason = ' '.join(reason)
        for current_user in report['users']:
            if current_user['name'] == user.id and current_user['guild_id'] == user.guild.id:
                current_user['reasons'].append(reason)
                break
        else:
            report['users'].append({
                'guild_id': ctx.guild.id,
                'name': user.id,
                'reasons': [reason, ]
            })
        with open(PATH, 'w+') as f:
            json.dump(report, f)

    @commands.command(name="warnings", help="See the number of warnings for an user")
    @has_permissions(manage_roles=True, kick_members=True)
    async def warnings(self, ctx, user: discord.User):
        for current_user in report['users']:
            if user.id == current_user['name'] and current_user['guild_id'] == ctx.guild.id:
                await ctx.send(f"{user.name} has been reported {len(current_user['reasons'])} times : {', '.join(current_user['reasons'])}")
                break
        else:
            await ctx.send(f"{user.name} has never been reported")

    @commands.command(help="Kick a user")
    @has_permissions(manage_roles=True, kick_members=True)
    async def kick(self, ctx, user: discord.Member, *, reason=None):
        embed = discord.Embed(
            title=f'Member kicked', description=f'{user.name} has been kicked {user.guild.name} because {reason}!', colour=0xFF00FF)
        embed.set_thumbnail(url=user.avatar_url)
        embed.set_footer(icon_url=ctx.author.avatar_url,
                         text=f'Requested by {ctx.author.name}.')
        embed.timestamp = datetime.datetime.utcnow()
        await ctx.guild.kick(user=user, reason=reason)
        await ctx.send(embed=embed)

    @commands.command(help="Ban a user")
    @has_permissions(manage_roles=True, ban_members=True)
    async def ban(self, ctx, user: discord.Member, *, reason=None):
        embed = discord.Embed(
            title=f'Member banned', description=f'{user.name} has been banned {user.guild.name} becasue {reason}!', colour=0xFF00FF)
        embed.set_thumbnail(url=user.avatar_url)
        embed.set_footer(icon_url=ctx.author.avatar_url,
                         text=f'Requested by {ctx.author.name}.')
        embed.timestamp = datetime.datetime.utcnow()
        await ctx.guild.ban(user=user, reason=reason)
        await ctx.send(embed=embed)

    # Cog slash commands

    @slash_command(name="purge", description="Delete messages", options=[
        Option("number", "the amount of messages to purge",
               OptionType.INTEGER, required=True)
    ])
    @dislash.has_permissions(manage_roles=True, ban_members=True)
    async def _purge(self, ctx, number: int = None):
        try:
            if number is None:
                await ctx.send("Insert a number!")
            else:
                deleted = await ctx.message.channel.purge(limit=number)
                await ctx.send(f"Message deleted by {ctx.author.mention}: {len(deleted)}.")
        except:
            await ctx.send("There was an error deleting")

    @slash_command(name="warn", description="Warn an user", options=[
        Option("user", "the user to warn", OptionType.USER, required=True),
        Option("reason", "the reason to warn",
               OptionType.STRING, required=True)
    ])
    @dislash.has_permissions(manage_roles=True, ban_members=True)
    async def _warn(self, ctx, user: discord.Member, *reason: str):
        if not reason:
            await ctx.send("Please provide a reason")
            return
        await ctx.send("user warned.")
        reason = ' '.join(reason)
        for current_user in report['users']:
            if current_user['name'] == user.id and current_user['guild_id'] == user.guild.id:
                current_user['reasons'].append(reason)
                break
        else:
            report['users'].append({
                'guild_id': ctx.guild.id,
                'name': user.id,
                'reasons': [reason, ]
            })
        with open(PATH, 'w+') as f:
            json.dump(report, f)

    @slash_command(name="warnings", description="See the number of warnings for an user", options=[
        Option("user", "mention the user that you want to see the number of warnings",
               OptionType.USER, required=True)
    ])
    @dislash.has_permissions(manage_roles=True, kick_members=True)
    async def _warnings(self, ctx, user: discord.User):
        for current_user in report['users']:
            if user.id == current_user['name'] and current_user['guild_id'] == ctx.guild.id:
                await ctx.send(f"{user.name} has been reported {len(current_user['reasons'])} times : {','.join(current_user['reasons'])}")
                break
        else:
            await ctx.send(f"{user.name} has never been reported")

    @slash_command(name="kick", description="Kick a user", options=[
        Option("user", "the user to kick", OptionType.USER, required=True),
        Option("reason", "the reason to kick",
               OptionType.STRING, required=True)
    ])
    async def _kick(self, ctx, user: discord.Member, *, reason=None):
        embed = discord.Embed(
            title=f'Member kicked', description=f'{user.name} has been kicked {user.guild.name} because {reason}!', colour=0xFF00FF)
        embed.set_thumbnail(url=user.avatar_url)
        embed.set_footer(icon_url=ctx.author.avatar_url,
                         text=f'Requested by {ctx.author.name}.')
        embed.timestamp = datetime.datetime.utcnow()
        await ctx.guild.kick(user=user, reason=reason)
        await ctx.send(embed=embed)

    @slash_command(name="ban", description="Ban a user", options=[
        Option("user", "the user to ban", OptionType.USER, required=True),
        Option("reason", "the reason to ban",
               OptionType.STRING, required=True)
    ])
    @dislash.has_permissions(manage_roles=True, ban_members=True)
    async def _ban(self, ctx, user: discord.Member, *, reason=None):
        embed = discord.Embed(
            title=f'Member banned', description=f'{user.name} has been banned {user.guild.name} becasue {reason}!', colour=0xFF00FF)
        embed.set_thumbnail(url=user.avatar_url)
        embed.set_footer(icon_url=ctx.author.avatar_url,
                         text=f'Requested by {ctx.author.name}.')
        embed.timestamp = datetime.datetime.utcnow()
        await ctx.guild.ban(user=user, reason=reason)
        await ctx.send(embed=embed)


def setup(bot):
    bot.add_cog(ModCog(bot))
