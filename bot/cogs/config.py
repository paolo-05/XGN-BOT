import typing

import constants
import discord
from discord.ext import commands
from dislash import *
from models import (GuildConfig, LeaveConfig, LevelUpConfig, LogChannel,
                    WelcomeConfig)


class Config(commands.Cog):
    """
    In this module there are command to configurate the bot
    """

    def __init__(self, bot: commands.Bot):
        self.bot = bot
        print(f"Loaded {self.__class__.__name__} cog")

    @commands.command(name="prefix", help="select the prefix for your server")
    @commands.has_guild_permissions(manage_guild=True)
    async def prefix(
            self, ctx: commands.Context):
        config = await GuildConfig.filter(id=ctx.guild.id).get_or_none()
        row = ActionRow(
            Button(style=ButtonStyle.link, label=f"Modify the prefix",
                   url=f"https://xgnbot.xyz/guilds/{ctx.guild.id}/settings")
        )
        return await ctx.send(
            f"The current prefix for this server is {config.prefix if config else constants.DEFAULT_PREFIX}",
            components=[row]
        )

    @commands.command()
    async def welcome_event(self, ctx: commands.Context):
        config = await GuildConfig.filter(id=ctx.guild.id).get_or_none()
        welcome_config = await WelcomeConfig.filter(guild_id=ctx.guild.id).get_or_none()
        row = ActionRow(Button(style=ButtonStyle.link, label=f"Modify the welcome event",
                        url=f"https://xgnbot.xyz/guilds/{ctx.guild.id}/welcome"))
        if config.welcome_enabled:
            welcome_channel = discord.utils.get(
                ctx.guild.channels, id=welcome_config.channel_id
            )
            return await ctx.send(
                f"Welcome messages are enabled in this guild. All member join events will be sent to {welcome_channel.mention}", components=[row]
            )
        else:
            return await ctx.send("Welcome messages are not enabled for this guild", components=[row])

    @commands.command()
    async def leave_event(self, ctx: commands.Context):
        config = await GuildConfig.filter(id=ctx.guild.id).get_or_none()
        leave_config = await LeaveConfig.filter(guild_id=ctx.guild.id).get_or_none()
        row = ActionRow(Button(style=ButtonStyle.link, label=f"Modify the welcome event",
                        url=f"https://xgnbot.xyz/guilds/{ctx.guild.id}/leave"))
        if config.leave_enabled:
            leave_channel = discord.utils.get(
                ctx.guild.channels, id=leave_config.channel_id
            )
            return await ctx.send(
                f"Leave messages are enabled in this guild. All member leave events will be sent to {leave_channel.mention}", components=[row]
            )
        else:
            return await ctx.send("Leave messages are not enabled for this guild", components=[row])

    @commands.command()
    async def log(self, ctx: commands.Context):
        config = await GuildConfig.filter(id=ctx.guild.id).get_or_none()
        log_config = await LogChannel.filter(guild_id=ctx.guild.id).get_or_none()
        row = ActionRow(Button(style=ButtonStyle.link, label=f"Modify the welcome event",
                        url=f"https://xgnbot.xyz/guilds/{ctx.guild.id}/logging"))
        if config.log_enabled:
            log_channel = discord.utils.get(
                ctx.guild.channels, id=log_config.channel_id
            )
            return await ctx.send(
                f"Log messages are enabled in this guild. All member log events will be sent to {log_channel.mention}", components=[row]
            )
        else:
            return await ctx.send("Log messages are not enabled for this guild", components=[row])

    @commands.command()
    @commands.has_guild_permissions(manage_guild=True)
    async def levelling(self, ctx: commands.Context):
        config = await GuildConfig.filter(id=ctx.guild.id).get_or_none()
        levelling_config = await LevelUpConfig.filter(guild_id=ctx.guild.id).get_or_none()
        row = ActionRow(Button(style=ButtonStyle.link, label=f"Modify the welcome event",
                        url=f"https://xgnbot.xyz/guilds/{ctx.guild.id}/leveling"))
        if config.level_up_enabled:
            log_channel = discord.utils.get(
                ctx.guild.channels, id=levelling_config.channel_id
            )
            return await ctx.send(
                f"Level system is enabled in this guild. All level up messages will be sent to {log_channel.mention}", components=[row]
            )
        else:
            return await ctx.send("The levelling system is not enabled", components=[row])


def setup(bot: commands.Bot):
    bot.add_cog(Config(bot))
