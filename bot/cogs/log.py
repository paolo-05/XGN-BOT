import datetime

import discord
from discord import Embed
from discord.ext import commands
from models import GuildConfig, LogChannel


def get_changed_roles(before: discord.Member, after: discord.Member):
    dic = {}
    for i in before.roles:
        if i not in after.roles:
            dic[i] = "given"
    for i in after.roles:
        if i not in before.roles:
            dic[i] = "removed"

    return dic


class Log(commands.Cog):
    """
    This module has no commands, but is a event handler for the audit logs
    """

    def __init__(self, bot):
        self.bot = bot

    @commands.Cog.listener()
    async def on_message_edit(self, before, after):
        if not after.author.bot:
            if before.content != after.content:
                embed = Embed(title="Message edit",
                              description=f"Edit by {after.author.display_name}.",
                              colour=after.author.colour,
                              timestamp=datetime.datetime.utcnow())

                fields = [("Before", f"`{before.content}`", False),
                          ("After", f"`{after.content}`\n\n[jump to message](https://discord.com/channels/{after.guild.id}/{after.channel.id}/{after.id})", False)]

                for name, value, inline in fields:
                    embed.add_field(name=name, value=value, inline=inline)

                config = await GuildConfig.filter(id=after.guild.id).get_or_none()
                if not config:
                    return

                if config.log_enabled:
                    log_channel = await LogChannel.filter(
                        guild_id=after.guild.id
                    ).get_or_none()

                    send_channel = discord.utils.get(
                        after.guild.channels, id=log_channel.channel_id)

                    await send_channel.send(embed=embed)

    @commands.Cog.listener()
    async def on_message_delete(self, message):
        if not message.author.bot:
            embed = Embed(title="Message deletion",
                          description=f"Action by {message.author.mention}.",
                          colour=message.author.colour,
                          timestamp=datetime.datetime.utcnow())

            fields = [("Content", f"`{message.content}`", False)]

            for name, value, inline in fields:
                embed.add_field(name=name, value=value, inline=inline)

            config = await GuildConfig.filter(id=message.guild.id).get_or_none()
            if not config:
                return

            if config.log_enabled:
                log_channel = await LogChannel.filter(
                    guild_id=message.guild.id
                ).get_or_none()

                send_channel = discord.utils.get(
                    message.guild.channels, id=log_channel.channel_id)

                await send_channel.send(embed=embed)

    @commands.Cog.listener()
    async def on_guild_channel_delete(self, channel: discord.abc.GuildChannel):
        if channel.category is None:
            date = datetime.datetime.utcnow()
            embed = discord.Embed(
                title=f"a category has been deleted", timestamp=date, colour=0x00aaff)
            embed.set_author(name=self.bot.user,
                             icon_url=self.bot.user.avatar_url)
            embed.add_field(name="category", value=str(
                channel), inline=False)
            embed.add_field(name="date", value=f"{date}", inline=False)
        else:
            date = datetime.datetime.utcnow()
            embed = discord.Embed(
                title=f"a channel has been deleted", timestamp=date)
            embed.set_author(name=self.bot.user,
                             icon_url=self.bot.user.avatar_url)
            embed.add_field(name="channel", value=str(
                channel), inline=False)
            embed.add_field(name="date", value=f"{date}", inline=False)
        config = await GuildConfig.filter(id=channel.guild.id).get_or_none()
        if not config:
            return

        if config.log_enabled:
            log_channel = await LogChannel.filter(
                guild_id=channel.guild.id
            ).get_or_none()

            send_channel = discord.utils.get(
                channel.guild.channels, id=log_channel.channel_id)

            await send_channel.send(embed=embed)
        else:
            return

    @commands.Cog.listener()
    async def on_guild_channel_create(self, channel: discord.abc.GuildChannel):
        if channel.category is None:
            date = datetime.datetime.utcnow()
            embed = discord.Embed(
                title=f"a category has been created", timestamp=date, colour=0x00aaff)
            embed.set_author(name=self.bot.user,
                             icon_url=self.bot.user.avatar_url)
            embed.add_field(name="category",
                            value=channel.mention, inline=False)
            embed.add_field(name="date", value=f"{date}", inline=False)
        else:
            date = datetime.datetime.utcnow()
            embed = discord.Embed(
                title=f"a channel has been created", timestamp=date)
            embed.set_author(name=self.bot.user,
                             icon_url=self.bot.user.avatar_url)
            embed.add_field(
                name="channel", value=channel.mention, inline=False)
            embed.add_field(name="date", value=f"{date}", inline=False)

        config = await GuildConfig.filter(id=channel.guild.id).get_or_none()
        if not config:
            return

        if config.log_enabled:
            log_channel = await LogChannel.filter(
                guild_id=channel.guild.id
            ).get_or_none()

            send_channel = discord.utils.get(
                channel.guild.channels, id=log_channel.channel_id)

            await send_channel.send(embed=embed)
        else:
            return

    @commands.Cog.listener()
    async def on_guild_channel_update(self, before: discord.abc.GuildChannel, after: discord.abc.GuildChannel):
        async for author in before.guild.audit_logs(limit=1, oldest_first=False, action=discord.AuditLogAction.channel_update):
            if author.user.id == self.bot.user.id:
                return
        config = await GuildConfig.filter(id=before.guild.id).get_or_none()
        if not config:
            return

        if config.log_enabled:
            log_channel = await LogChannel.filter(
                guild_id=before.guild.id
            ).get_or_none()

            send_channel = discord.utils.get(
                before.guild.channels, id=log_channel.channel_id)
        else:
            return
        if after.category is None:
            date = datetime.datetime.utcnow()
            if before.name != after.name:
                embed = discord.Embed(
                    title=f"a category has been renamed", timestamp=date)
                embed.set_author(name=self.bot.user,
                                 icon_url=self.bot.user.avatar_url, colour=0x00aaff)
                embed.add_field(name="category", value=after.mention)
                embed.add_field(name="before name", value=before.name)
                embed.add_field(name="after name", value=after.name)
                embed.add_field(name="date", value=f"{date}", inline=False)

                await send_channel.send(embed=embed)
            else:
                embed = discord.Embed(
                    title=f"a category has been changed", timestamp=date, colour=0x00aaff)
                embed.set_author(name=self.bot.user,
                                 icon_url=self.bot.user.avatar_url)
                embed.add_field(name="category", value=after.mention)
                embed.add_field(name="date", value=f"{date}", inline=False)
                await send_channel.send(embed=embed)
        else:
            date = datetime.datetime.utcnow()
            if before.name != after.name:
                embed = discord.Embed(
                    title=f"a channel has been renamed", timestamp=date, colour=0x00aaff)
                embed.set_author(name=self.bot.user,
                                 icon_url=self.bot.user.avatar_url)
                embed.add_field(name="channel", value=after.mention)
                embed.add_field(name="before name", value=before.name)
                embed.add_field(name="after name", value=after.name)
                embed.add_field(name="date", value=f"{date}", inline=False)
                await send_channel.send(embed=embed)
            else:
                embed = discord.Embed(
                    title=f"a channel has been changed", timestamp=date, colour=0x00aaff)
                embed.set_author(name=self.bot.user,
                                 icon_url=self.bot.user.avatar_url)
                embed.add_field(name="channel", value=after.mention)
                embed.add_field(name="date", value=f"{date}", inline=False)
                await send_channel.send(embed=embed)

    @commands.Cog.listener()
    async def on_member_update(self, before: discord.Member, after: discord.Member):
        config = await GuildConfig.filter(id=before.guild.id).get_or_none()
        if not config:
            return

        if config.log_enabled:
            log_channel = await LogChannel.filter(
                guild_id=before.guild.id
            ).get_or_none()

            send_channel = discord.utils.get(
                before.guild.channels, id=log_channel.channel_id)
        else:
            return

        if before.nick != after.nick:
            embed = discord.Embed(
                title=f"{after} had his nickname changed", timestamp=datetime.datetime.utcnow(), colour=after.colour)
            embed.set_author(name=f"{after}", icon_url=after.avatar_url)
            embed.add_field(
                name="Member", value=after.mention, inline=False)
            embed.add_field(
                name="Date", value=f"{datetime.datetime.utcnow()}", inline=False)
            embed.add_field(name="before name", value=before.display_name)
            embed.add_field(name="After name", value=after.display_name)
            await send_channel.send(embed=embed)
        if before.roles != after.roles:
            removed_roles = ""
            added_roles = ""
            roles: dict = get_changed_roles(after, before)
            for i in roles:
                if roles[i] == "removed":
                    removed_roles += f"{i.name}({i.id}) \n"
                elif roles[i] == "given":
                    added_roles += f"{i.name}({i.id}) \n"
            embed = discord.Embed(
                title=f"{after} had his roles changed", timestamp=datetime.datetime.utcnow(), colour=after.colour)
            embed.set_author(name=f"{after}", icon_url=after.avatar_url)
            embed.add_field(
                name="Member", value=after.mention, inline=False)
            embed.add_field(
                name="Date", value=f"{datetime.datetime.utcnow()}", inline=False)
            if added_roles != "":
                embed.add_field(name="given roles",
                                value=f"{added_roles}", inline=False)
            if removed_roles != "":
                embed.add_field(name="removed roles",
                                value=f"{removed_roles}", inline=False)
            await send_channel.send(embed=embed)

    @commands.Cog.listener()
    async def on_guild_role_create(self, role: discord.Role):
        embed = discord.Embed(
            title=f"{role.name} has been created", timestamp=datetime.datetime.utcnow(), colour=role.colour)
        embed.set_author(name=f"{self.bot.user}",
                         icon_url=self.bot.user.avatar_url)
        embed.add_field(name=f"role", value=role.mention, inline=False)
        embed.add_field(name="ID", value=f"```py\n Role = {role.id}\n```")

        config = await GuildConfig.filter(id=role.guild.id).get_or_none()
        if not config:
            return

        if config.log_enabled:
            log_channel = await LogChannel.filter(
                guild_id=role.guild.id
            ).get_or_none()

            send_channel = discord.utils.get(
                role.guild.channels, id=log_channel.channel_id)

            await send_channel.send(embed=embed)
        else:
            return

    @commands.Cog.listener()
    async def on_guild_role_delete(self, role: discord.Role):
        embed = discord.Embed(
            title=f"{role.name} has been deleted", timestamp=datetime.datetime.utcnow(), colour=role.colour)
        embed.set_author(name=f"{self.bot.user}",
                         icon_url=self.bot.user.avatar_url)
        embed.add_field(name=f"role", value=role.mention, inline=False)
        embed.add_field(name="ID", value=f"```py\n Role = {role.id}\n```")
        config = await GuildConfig.filter(id=role.guild.id).get_or_none()
        if not config:
            return

        if config.log_enabled:
            log_channel = await LogChannel.filter(
                guild_id=role.guild.id
            ).get_or_none()

            send_channel = discord.utils.get(
                role.guild.channels, id=log_channel.channel_id)

            await send_channel.send(embed=embed)
        else:
            return

    @commands.Cog.listener()
    async def on_guild_role_update(self, before: discord.Role, after: discord.Role):
        """
        :param after: represent the after role
        :param before: represent the before role
        :type before: discord.Role
        """
        embed = discord.Embed(
            title=f"{after.name} has been updated", timestamp=datetime.datetime.utcnow(), colour=after.colour)
        embed.set_author(name=f"{self.bot.user}",
                         icon_url=self.bot.user.avatar_url)
        embed.add_field(name=f"role", value=after.name, inline=False)
        embed.add_field(name="ID", value=f"```py\n Role = {after.id}\n```")
        config = await GuildConfig.filter(id=after.guild.id).get_or_none()
        if not config:
            return

        if config.log_enabled:
            log_channel = await LogChannel.filter(
                guild_id=after.guild.id
            ).get_or_none()

            send_channel = discord.utils.get(
                after.guild.channels, id=log_channel.channel_id)

            await send_channel.send(embed=embed)
        else:
            return

    @commands.Cog.listener()
    async def on_voice_state_update(self, member: discord.Member, before: discord.VoiceState,
                                    after: discord.VoiceState):
        date = datetime.datetime.utcnow()

        config = await GuildConfig.filter(id=member.guild.id).get_or_none()
        if not config:
            return

        if config.log_enabled:
            log_channel = await LogChannel.filter(
                guild_id=member.guild.id
            ).get_or_none()

            audit_log_channel = discord.utils.get(
                member.guild.channels, id=log_channel.channel_id)
        else:
            return

        if after.channel != before.channel:
            if before.channel is None:  # joined voice
                embed = discord.Embed(
                    timestamp=date, title=f"{member} has joined {after.channel}", colour=member.colour)
                embed.set_author(name=f"{member}",
                                 icon_url=member.avatar_url)
                embed.add_field(
                    name="channel", value=f"{after.channel}", inline=False)
                embed.add_field(name="ID",
                                value=f"```py\n Channel = {after.channel.id}\n Member = {member.id}\n```",
                                inline=False)
                await audit_log_channel.send(embed=embed)
            elif after.channel is None:
                embed = discord.Embed(
                    timestamp=date, title=f"{member} has left {before.channel} ")
                embed.set_author(name=f"{member}",
                                 icon_url=member.avatar_url)
                embed.add_field(
                    name="channel", value=f"{before.channel}", inline=False)
                embed.add_field(name="ID",
                                value=f"```py\n Channel = {before.channel.id}\n Member = {member.id}\n```",
                                inline=False)
                await audit_log_channel.send(embed=embed)
            else:
                embed = discord.Embed(timestamp=date,
                                      title=f"{member} has moved from {before.channel} to {after.channel}", colour=member.colour)
                embed.set_author(name=f"{member}",
                                 icon_url=member.avatar_url)
                embed.add_field(name="before channel",
                                value=f"{before.channel}", inline=False)
                embed.add_field(name="after channel",
                                value=f"{after.channel}", inline=False)
                embed.add_field(name="ID",
                                value=f"```py\n before channel = {before.channel.id}\n After channel = {after.channel.id}\n Member = {member.id}\n```",
                                inline=False)
                await audit_log_channel.send(embed=embed)
        if before.deaf != after.deaf:
            if after.deaf is True:
                embed = discord.Embed(timestamp=date,
                                      title=f"{member} has been server deafened at {after.channel}", colour=member.colour)
                embed.set_author(name=f"{member}",
                                 icon_url=member.avatar_url)
                embed.add_field(
                    name="channel", value=f"{after.channel}", inline=False)
                embed.add_field(name="ID",
                                value=f"```py\n Channel = {after.channel.id}\n Member = {member.id}\n```",
                                inline=False)
                await audit_log_channel.send(embed=embed)
            else:
                embed = discord.Embed(timestamp=date,
                                      title=f"{member} has been server undeafened at {after.channel}", colour=member.colour)
                embed.set_author(name=f"{member}",
                                 icon_url=member.avatar_url)
                embed.add_field(
                    name="channel", value=f"{after.channel}", inline=False)
                embed.add_field(name="ID",
                                value=f"```py\n Channel = {after.channel.id}\n Member = {member.id}\n```",
                                inline=False)
                await audit_log_channel.send(embed=embed)
        if before.mute != after.mute:
            if after.mute is True:
                embed = discord.Embed(timestamp=date,
                                      title=f"{member} has been server muted at {after.channel}", colour=member.colour)
                embed.set_author(name=f"{member}",
                                 icon_url=member.avatar_url)
                embed.add_field(
                    name="channel", value=f"{after.channel}", inline=False)
                embed.add_field(name="ID",
                                value=f"```py\n Channel = {after.channel.id}\n Member = {member.id}\n```",
                                inline=False)
                await audit_log_channel.send(embed=embed)
            else:
                embed = discord.Embed(timestamp=date,
                                      title=f"{member} has been server unmuted at {after.channel}", colour=member.colour)
                embed.set_author(name=f"{member}",
                                 icon_url=member.avatar_url)
                embed.add_field(
                    name="channel", value=f"{after.channel}", inline=False)
                embed.add_field(name="ID",
                                value=f"```py\n Channel = {after.channel.id}\n Member = {member.id}\n```",
                                inline=False)
                await audit_log_channel.send(embed=embed)

    @commands.Cog.listener()
    async def on_member_ban(self, guild: discord.Guild, user: discord.User):
        date = datetime.datetime.utcnow()
        config = await GuildConfig.filter(id=guild.id).get_or_none()
        if not config:
            return

        if config.log_enabled:
            log_channel = await LogChannel.filter(
                guild_id=guild.id
            ).get_or_none()

            audit_log_channel = discord.utils.get(
                guild.channels, id=log_channel.channel_id)
        else:
            return

        embed = discord.Embed(
            title=f"{user} has been banned", timestamp=date, colour=0x00aaff)
        embed.set_author(name=f"{user}", icon_url=user.avatar_url)
        embed.add_field(name="ID", value=f"```py\n User = {user.id}\n```")
        await audit_log_channel.send(embed=embed)

    @commands.Cog.listener()
    async def on_member_unban(self, guild: discord.Guild, user: discord.User):
        date = datetime.datetime.utcnow()
        config = await GuildConfig.filter(id=guild.id).get_or_none()
        if not config:
            return

        if config.log_enabled:
            log_channel = await LogChannel.filter(
                guild_id=guild.id
            ).get_or_none()

            audit_log_channel = discord.utils.get(
                guild.channels, id=log_channel.channel_id)
        else:
            return
        embed = discord.Embed(
            title=f"{user} has been unbanned", timestamp=date, colour=0x00aaff)
        embed.set_author(name=f"{user}", icon_url=user.avatar_url)
        embed.add_field(name="ID", value=f"```py\n User = {user.id}\n```")
        await audit_log_channel.send(embed=embed)


def setup(bot):
    bot.add_cog(Log(bot))
