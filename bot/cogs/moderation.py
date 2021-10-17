import datetime
import json

import discord
from discord.ext import commands
from discord.ext.commands import has_permissions
from discord_slash import SlashContext
from discord_slash.cog_ext import cog_slash
from models import GuildConfig, LogChannel

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
                await ctx.send(f"Message deleted by {ctx.message.author.mention}: {len(deleted)}.")
                # CHANGE LOG

                embed = discord.Embed(title=f"Purge <:sirenevermelha:623571834469744701>",
                                      description=f"**mod**: {ctx.author.name}, {ctx.author.id}\n **channel**: {ctx.channel.name}, {ctx.channel.id}\n **N° of message(s)**: {len(deleted)}", colour=0xFF00FF)
                embed.set_footer(icon_url=ctx.author.avatar_url,
                                 text=f'Requested by {ctx.author.name} in {ctx.author.guild}')
                embed.timestamp = datetime.datetime.utcnow()

                config = await GuildConfig.filter(id=ctx.guild.id).get_or_none()
                if not config:
                    return

                if config.log_enabled:
                    log_channel = await LogChannel.filter(
                        guild_id=ctx.guild.id
                    ).get_or_none()

                    send_channel = discord.utils.get(
                        ctx.guild.channels, id=log_channel.channel_id)

                    await send_channel.send(embed=embed)
        except:
            await ctx.send("I can't.")

    @cog_slash(name="purge", description="Delete messages")
    @has_permissions(manage_roles=True, ban_members=True)
    async def _purge(self, ctx: SlashContext, number: int = None):
        try:
            if number is None:
                await ctx.send("Insert a number!")
            else:
                deleted = await ctx.channel.purge(limit=number)
                await ctx.send(f"Message deleted by {ctx.author.mention}: {len(deleted)}.")
                # CHANGE LOG

                embed = discord.Embed(title=f"Purge <:sirenevermelha:623571834469744701>",
                                      description=f"**mod**: {ctx.author.name}, {ctx.author.id}\n **channel**: {ctx.channel.name}, {ctx.channel.id}\n **N° of message(s)**: {len(deleted)}", colour=0xFF00FF)
                embed.set_footer(icon_url=ctx.author.avatar_url,
                                 text=f'Requested by {ctx.author.name} in {ctx.author.guild}')
                embed.timestamp = datetime.datetime.utcnow()

                config = await GuildConfig.filter(id=ctx.guild.id).get_or_none()
                if not config:
                    return

                if config.log_enabled:
                    log_channel = await LogChannel.filter(
                        guild_id=ctx.guild.id
                    ).get_or_none()

                    send_channel = discord.utils.get(
                        ctx.guild.channels, id=log_channel.channel_id)

                    await send_channel.send(embed=embed)
        except:
            await ctx.send('Error')

    @commands.command(name="warn", help="Warn an user")
    @has_permissions(manage_roles=True, ban_members=True)
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

            # CHANGE LOG
        embed = discord.Embed(title=f"warn <:sirenevermelha:623571834469744701>",
                              description=f"**mod**: {ctx.author.name}, {ctx.author.id}\n **user**: {user.name}, {user.id}\n **reason**: {reason}", colour=0xFF00FF)
        embed.set_footer(icon_url=ctx.author.avatar_url,
                         text=f'Requested by {ctx.author.name} in {ctx.author.guild}')
        embed.timestamp = datetime.datetime.utcnow()

        config = await GuildConfig.filter(id=ctx.guild.id).get_or_none()
        if not config:
            return

        if config.log_enabled:
            log_channel = await LogChannel.filter(
                guild_id=ctx.guild.id
            ).get_or_none()

            send_channel = discord.utils.get(
                ctx.guild.channels, id=log_channel.channel_id)

            await send_channel.send(embed=embed)

    @cog_slash(name="warn", description="Warn an user")
    @has_permissions(manage_roles=True, ban_members=True)
    async def _warn(self, ctx: SlashContext, user: discord.Member, reason: str):
        if not reason:
            await ctx.send("Please provide a reason")
            return
        await ctx.send("user warned.")
        reason = ''.join(reason)
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

            # CHANGE LOG
        embed = discord.Embed(title=f"warn <:sirenevermelha:623571834469744701>",
                              description=f"**mod**: {ctx.author.name}, {ctx.author.id}\n **user**: {user.name}, {user.id}\n **reason**: {reason}", colour=0xFF00FF)
        embed.set_footer(icon_url=ctx.author.avatar_url,
                         text=f'Requested by {ctx.author.name} in {ctx.author.guild}')
        embed.timestamp = datetime.datetime.utcnow()

        config = await GuildConfig.filter(id=ctx.guild.id).get_or_none()
        if not config:
            return

        if config.log_enabled:
            log_channel = await LogChannel.filter(
                guild_id=ctx.guild.id
            ).get_or_none()

            send_channel = discord.utils.get(
                ctx.guild.channels, id=log_channel.channel_id)

            await send_channel.send(embed=embed)

    @commands.command(name="warnings", help="See the number of warnings for an user")
    async def warnings(self, ctx, user: discord.User):
        for current_user in report['users']:
            if user.id == current_user['name'] and current_user['guild_id'] == ctx.guild.id:
                await ctx.send(f"{user.name} has been reported {len(current_user['reasons'])} times : {','.join(current_user['reasons'])}")
                break
        else:
            await ctx.send(f"{user.name} has never been reported")

    @cog_slash(name="warnings", description="See the number of warnings for an user")
    async def _warnings(self, ctx: SlashContext, user: discord.User = None):
        if user is None:
            user = ctx.author
        for current_user in report['users']:
            if user.id == current_user['name'] and current_user['guild_id'] == ctx.guild.id:
                await ctx.send(f"{user.name} has been reported {len(current_user['reasons'])} times : {', '.join(current_user['reasons'])}")
                break
        else:
            await ctx.send(f"{user.name} has never been reported")

    @commands.command(help="Kick a user")
    async def kick(self, ctx, user: discord.Member, *, reason=None):
        embed = discord.Embed(
            title=f'Member kicked', description=f'{user.name} has been kicked {user.guild.name} because {reason}!', colour=0xFF00FF)
        embed.set_thumbnail(url=user.avatar_url)
        embed.set_footer(icon_url=ctx.author.avatar_url,
                         text=f'Requested by {ctx.author.name}.')
        embed.timestamp = datetime.datetime.utcnow()
        await ctx.guild.kick(user=user, reason=reason)
        await ctx.send(embed=embed)

        # CHANGE LOG
        embed = discord.Embed(title=f"Kick <:sirenevermelha:623571834469744701>",
                              description=f"**mod**: {ctx.author.name}, {ctx.author.id}\n **user**: {user.name}, {user.id}\n **reason**: {reason}", colour=0xFF00FF)
        embed.set_footer(icon_url=ctx.author.avatar_url,
                         text=f'Requested by {ctx.author.name} in {ctx.author.guild}')
        embed.timestamp = datetime.datetime.utcnow()

        config = await GuildConfig.filter(id=ctx.guild.id).get_or_none()
        if not config:
            return

        if config.log_enabled:
            log_channel = await LogChannel.filter(
                guild_id=ctx.guild.id
            ).get_or_none()

            send_channel = discord.utils.get(
                ctx.guild.channels, id=log_channel.channel_id)

            await send_channel.send(embed=embed)

    @cog_slash(name="kick", description="Kick a user")
    async def _kick(self, ctx: SlashContext, user: discord.Member, reason: str = None):
        embed = discord.Embed(
            title=f'Member kicked', description=f'{user.name} has been kicked {user.guild.name} because {reason}!', colour=0xFF00FF)
        embed.set_thumbnail(url=user.avatar_url)
        embed.set_footer(icon_url=ctx.author.avatar_url,
                         text=f'Requested by {ctx.author.name}.')
        embed.timestamp = datetime.datetime.utcnow()
        await ctx.guild.kick(user=user, reason=reason)
        await ctx.send(embed=embed)

        # CHANGE LOG
        embed = discord.Embed(
            title=f"Kick", description=f"**mod**: {ctx.author.name}, {ctx.author.id}\n **user**: {user.name}, {user.id}\n **reason**: {reason}", colour=0xFF00FF)
        embed.set_footer(icon_url=ctx.author.avatar_url,
                         text=f'Requested by {ctx.author.name} in {ctx.author.guild}')
        embed.timestamp = datetime.datetime.utcnow()

        config = await GuildConfig.filter(id=ctx.guild.id).get_or_none()
        if not config:
            return

        if config.log_enabled:
            log_channel = await LogChannel.filter(
                guild_id=ctx.guild.id
            ).get_or_none()

            send_channel = discord.utils.get(
                ctx.guild.channels, id=log_channel.channel_id)

            await send_channel.send(embed=embed)

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

        # CHANGE LOG
        embed = discord.Embed(
            title=f"Ban", description=f"**mod**: {ctx.author.name}, {ctx.author.id}\n **user**: {user.name}, {user.id}\n **reason**: {reason}", colour=0xFF00FF)
        embed.set_footer(icon_url=ctx.author.avatar_url,
                         text=f'requested {ctx.author.name} in {ctx.author.guild}')
        embed.timestamp = datetime.datetime.utcnow()

        config = await GuildConfig.filter(id=ctx.guild.id).get_or_none()
        if not config:
            return

        if config.log_enabled:
            log_channel = await LogChannel.filter(
                guild_id=ctx.guild.id
            ).get_or_none()

            send_channel = discord.utils.get(
                ctx.guild.channels, id=log_channel.channel_id)

            await send_channel.send(embed=embed)

    @cog_slash(name="ban", description="Ban a user")
    @has_permissions(manage_roles=True, ban_members=True)
    async def _ban(self, ctx: SlashContext, user: discord.Member, reason: str = None):
        embed = discord.Embed(
            title=f'Member banned', description=f'{user.name} has been banned {user.guild.name} becasue {reason}!', colour=0xFF00FF)
        embed.set_thumbnail(url=user.avatar_url)
        embed.set_footer(icon_url=ctx.author.avatar_url,
                         text=f'Requested by {ctx.author.name}.')
        embed.timestamp = datetime.datetime.utcnow()
        await ctx.guild.ban(user=user, reason=reason)
        await ctx.send(embed=embed)

        # CHANGE LOG
        embed = discord.Embed(
            title=f"Ban", description=f"**mod**: {ctx.author.name}, {ctx.author.id}\n **user**: {user.name}, {user.id}\n **reason**: {reason}", colour=0xFF00FF)
        embed.set_footer(icon_url=ctx.author.avatar_url,
                         text=f'requested {ctx.author.name} in {ctx.author.guild}')
        embed.timestamp = datetime.datetime.utcnow()

        config = await GuildConfig.filter(id=ctx.guild.id).get_or_none()
        if not config:
            return

        if config.log_enabled:
            log_channel = await LogChannel.filter(
                guild_id=ctx.guild.id
            ).get_or_none()

            send_channel = discord.utils.get(
                ctx.guild.channels, id=log_channel.channel_id)

            await send_channel.send(embed=embed)


def setup(bot):
    bot.add_cog(ModCog(bot))
