import typing

import constants
import discord
from discord.ext import commands
from models import (GuildConfig, LeaveConfig, LevelUpConfig, LogChannel,
                    WelcomeConfig)


class Config(commands.Cog):
    """
    In this module there are command to configurate the bot
    """

    def __init__(self, bot: commands.Bot):
        self.bot = bot
        print(f"Loaded {self.__class__.__name__} cog")

    @commands.command()
    @commands.has_guild_permissions(manage_guild=True)
    async def prefix(
        self, ctx: commands.Context, *, _prefix: typing.Optional[str] = None
    ):
        config = await GuildConfig.filter(id=ctx.guild.id).get_or_none()
        if not _prefix:
            return await ctx.send(
                f"The current prefix for this server is {config.prefix if config else constants.DEFAULT_PREFIX}"
            )

        if not config:
            new_config = GuildConfig(id=ctx.guild.id, prefix=_prefix)
            await new_config.save()
        else:
            config.prefix = _prefix
            await config.save()

        return await ctx.send(f"Set the prefix for this server to `{_prefix}`")

    @commands.command()
    async def welcome_event(self, ctx: commands.Context):
        config = await GuildConfig.filter(id=ctx.guild.id).get_or_none()
        welcome_config = await WelcomeConfig.filter(guild_id=ctx.guild.id).get_or_none()

        await ctx.send(f'you can modify this event by going here https://xgnbot.herokuapp.com/guild/{ctx.guild.id}')

        if config.welcome_enabled:
            welcome_channel = discord.utils.get(
                ctx.guild.channels, id=welcome_config.channel_id
            )
            return await ctx.send(
                f"Welcome messages are enabled in this guild. All member join events will be sent to {welcome_channel.mention}"
            )
        else:
            return await ctx.send("Welcome messages are not enabled for this guild")

    @commands.command()
    async def leave_event(self, ctx: commands.Context):
        config = await GuildConfig.filter(id=ctx.guild.id).get_or_none()
        leave_config = await LeaveConfig.filter(guild_id=ctx.guild.id).get_or_none()
        await ctx.send(f'you can modify this event by going here https://xgnbot.herokuapp.com/guild/{ctx.guild.id}')
        if config.leave_enabled:
            leave_channel = discord.utils.get(
                ctx.guild.channels, id=leave_config.channel_id
            )
            return await ctx.send(
                f"Leave messages are enabled in this guild. All member leave events will be sent to {leave_channel.mention}"
            )
        else:
            return await ctx.send("Leave messages are not enabled for this guild")

    @commands.command()
    async def log(self, ctx: commands.Context):
        config = await GuildConfig.filter(id=ctx.guild.id).get_or_none()
        log_config = await LogChannel.filter(guild_id=ctx.guild.id).get_or_none()
        await ctx.send(f'you can modify this event by going here https://xgnbot.herokuapp.com/guild/{ctx.guild.id}')
        if config.log_enabled:
            log_channel = discord.utils.get(
                ctx.guild.channels, id=log_config.channel_id
            )
            return await ctx.send(
                f"Log messages are enabled in this guild. All member log events will be sent to {log_channel.mention}"
            )
        else:
            return await ctx.send("Log messages are not enabled for this guild")

    @commands.command()
    @commands.has_guild_permissions(manage_guild=True)
    async def levelling(self, ctx: commands.Context):
        config = await GuildConfig.filter(id=ctx.guild.id).get_or_none()
        levelling_config = await LevelUpConfig.filter(guild_id=ctx.guild.id).get_or_none()
        await ctx.send(f'you can modify this event by going here https://xgnbot.herokuapp.com/guild/{ctx.guild.id}')
        if config.level_up_enabled:
            log_channel = discord.utils.get(
                ctx.guild.channels, id=levelling_config.channel_id
            )
            return await ctx.send(
                f"Level system is enabled in this guild. All level up messages will be sent to {log_channel.mention}"
            )
        else:
            return await ctx.send("The levelling system is not enabled")


def setup(bot: commands.Bot):
    bot.add_cog(Config(bot))
