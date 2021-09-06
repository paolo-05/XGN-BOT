import typing

import constants
import discord

from discord.ext import commands
from models import GuildConfig, LeaveConfig, LogChannel, WelcomeConfig, LevelUpConfig


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
    @commands.has_guild_permissions(manage_guild=True)
    async def setwelcome(self, ctx: commands.Context):
        async def ask_welcome_msg():
            try:
                msg: discord.Message = await self.bot.wait_for(
                    "message", check=lambda x: x.author.id == ctx.author.id, timeout=20
                )
                return await commands.TextChannelConverter().convert(ctx, msg.content)
            except commands.errors.ChannelNotFound as e:
                await ctx.send(
                    f"Invalid channel `{e.argument}`. Please enter a channel name again"
                )
                return await ask_welcome_msg()

        await ctx.send(
            "Please enter the channel where all the welcome messages will be sent."
        )
        channel = await ask_welcome_msg()

        await ctx.send(
            "Please enter your welcome message below. use `{}` where you want to mention the user"
        )
        welcome_msg = (
            await self.bot.wait_for(
                "message", check=lambda x: x.author.id == ctx.author.id, timeout=20
            )
        ).content

        config = await GuildConfig.filter(id=ctx.guild.id).get_or_none()
        welcome_config = await WelcomeConfig.filter(guild_id=ctx.guild.id).get_or_none()

        config.welcome_enabled = True
        await config.save()

        if not welcome_config:
            new_welcome_config = WelcomeConfig(
                guild_id=ctx.guild.id, channel_id=channel.id, message=welcome_msg
            )
            await new_welcome_config.save()
            return await ctx.send(
                f"Enabled welcome messages. All member join events will be sent to {channel.mention}."
            )
        else:
            welcome_config.channel_id = channel.id
            welcome_config.message = welcome_msg
            await welcome_config.save()
            return await ctx.send(
                f"Updated welcome config. All member join events will be sent to {channel.mention}."
            )

    @commands.command()
    async def leave_event(self, ctx: commands.Context):
        config = await GuildConfig.filter(id=ctx.guild.id).get_or_none()
        leave_config = await LeaveConfig.filter(guild_id=ctx.guild.id).get_or_none()

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
    @commands.has_guild_permissions(manage_guild=True)
    async def setleave(self, ctx: commands.Context):
        async def ask_leave_msg():
            try:
                msg: discord.Message = await self.bot.wait_for(
                    "message", check=lambda x: x.author.id == ctx.author.id, timeout=20
                )
                return await commands.TextChannelConverter().convert(ctx, msg.content)
            except commands.errors.ChannelNotFound as e:
                await ctx.send(
                    f"Invalid channel `{e.argument}`. Please enter a channel name again"
                )
                return await ask_leave_msg()

        await ctx.send(
            "Please enter the channel where all the leave messages will be sent."
        )
        channel = await ask_leave_msg()

        await ctx.send(
            "Please enter your leave message below. use `{}` where you want to mention the user"
        )
        leave_msg = (
            await self.bot.wait_for(
                "message", check=lambda x: x.author.id == ctx.author.id, timeout=20
            )
        ).content

        config = await GuildConfig.filter(id=ctx.guild.id).get_or_none()
        leave_config = await LeaveConfig.filter(guild_id=ctx.guild.id).get_or_none()

        config.leave_enabled = True
        await config.save()

        if not leave_config:
            new_welcome_config = LeaveConfig(
                guild_id=ctx.guild.id, channel_id=channel.id, message=leave_msg
            )
            await new_welcome_config.save()
            return await ctx.send(
                f"Enabled leave messages. All member leave events will be sent to {channel.mention}."
            )
        else:
            leave_config.channel_id = channel.id
            leave_config.message = leave_msg
            await leave_config.save()
            return await ctx.send(
                f"Updated leave config. All member leave events will be sent to {channel.mention}."
            )

    @commands.command()
    async def log(self, ctx: commands.Context):
        config = await GuildConfig.filter(id=ctx.guild.id).get_or_none()
        log_config = await LogChannel.filter(guild_id=ctx.guild.id).get_or_none()

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
    async def setlog(self, ctx: commands.Context, channel: discord.TextChannel):
        config = await GuildConfig.filter(id=ctx.guild.id).get_or_none()
        log_config = await LogChannel.filter(guild_id=ctx.guild.id).get_or_none()
        config.log_enabled = True
        await config.save()

        if not log_config:
            config.leave_enabled = True
            new_log_config = LogChannel(
                guild_id=ctx.guild.id, channel_id=channel.id
            )
            await new_log_config.save()
            return await ctx.send(
                f"Enabled log messages. All guild log will be sent to {channel.mention}."
            )
        else:
            log_config.channel_id = channel.id
            await log_config.save()
            return await ctx.send(
                f"Updated log config. All guild log will be sent to {channel.mention}."
            )

    @commands.command()
    @commands.has_guild_permissions(manage_guild=True)
    async def levelling(self, ctx: commands.Context):
        config = await GuildConfig.filter(id=ctx.guild.id).get_or_none()
        levelling_config = await LevelUpConfig.filter(guild_id=ctx.guild.id).get_or_none()

        if config.level_up_enabled:
            log_channel = discord.utils.get(
                ctx.guild.channels, id=levelling_config.channel_id
            )
            return await ctx.send(
                f"Level system is enabled in this guild. All level up messages will be sent to {log_channel.mention}"
            )
        else:
            return await ctx.send("The levelling system is not enabled")

    @commands.command()
    @commands.has_guild_permissions(manage_guild=True)
    async def setlevelling(self, ctx: commands.Context):
        async def ask_level_msg():
            try:
                msg: discord.Message = await self.bot.wait_for(
                    "message", check=lambda x: x.author.id == ctx.author.id, timeout=20
                )
                return await commands.TextChannelConverter().convert(ctx, msg.content)
            except commands.errors.ChannelNotFound as e:
                await ctx.send(
                    f"Invalid channel `{e.argument}`. Please enter a channel name again"
                )
                return await ask_level_msg()

        await ctx.send(
            "Please enter the channel where all the level up messages will be sent."
        )
        channel = await ask_level_msg()

        await ctx.send(
            "Please enter your level up message below. use `{mention}` where you want to mention the user and {level} for the current level"
        )
        levelup_msg = (
            await self.bot.wait_for(
                "message", check=lambda x: x.author.id == ctx.author.id, timeout=20
            )
        ).content

        config = await GuildConfig.filter(id=ctx.guild.id).get_or_none()
        levelup_config = await LevelUpConfig.filter(guild_id=ctx.guild.id).get_or_none()

        config.level_up_enabled= True
        await config.save()

        if not levelup_config:
            new_welcome_config = LevelUpConfig(
                guild_id=ctx.guild.id, channel_id=channel.id, message=levelup_msg
            )
            await new_welcome_config.save()
            return await ctx.send(
                f"Enabled levelling system. All level up events will be sent to {channel.mention}."
            )
        else:
            levelup_config.channel_id = channel.id
            levelup_config.message = levelup_msg
            await levelup_config.save()
            return await ctx.send(
                f"Updated levelling config. All level up events will be sent to {channel.mention}."
            )


def setup(bot: commands.Bot):
    bot.add_cog(Config(bot))
