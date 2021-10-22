from random import randint

import db
import discord
from discord import Embed
from discord.ext import commands
from discord.ext.commands import command
from discord.ext.menus import ListPageSource
from dislash import ActionRow, Button, ButtonStyle
from models import GuildConfig, LevelUpConfig
from dislash import (ActionRow, Button, ButtonStyle, Option, OptionType,
                     slash_command)

intents = discord.Intents.all()


multiplier = 1


class HelpMenu(ListPageSource):
    def __init__(self, ctx, data):
        self.ctx = ctx

        super().__init__(data, per_page=10)

    async def write_page(self, menu, offset, fields=[]):
        len_data = len(self.entries)

        embed = Embed(title="XP Leaderboard",
                      colour=self.ctx.author.colour)
        embed.set_thumbnail(url=self.ctx.guild.icon_url)
        embed.set_footer(
            text=f"{offset:,} - {min(len_data, offset+self.per_page-1):,} of {len_data:,} members.")

        for name, value in fields:
            embed.add_field(name=name, value=value, inline=False)

        return embed

    async def format_page(self, menu, entries):
        offset = (menu.current_page*self.per_page) + 1

        fields = []
        table = ("\n".join(f"{idx+offset}. {self.ctx.guild.get_member(entry[0]).display_name} (XP: {entry[1]} | Level: {entry[2]})"
                           for idx, entry in enumerate(entries)))

        fields.append(("Ranks", table))

        return await self.write_page(menu, offset, fields)


class LvlCog(commands.Cog, name="levelling"):
    """
    This commands can be used to interract with the levelling system.
    """

    def __init__(self, bot):
        self.bot = bot

    async def add_xp(self, message, xp, lvl):
        xp_to_add = randint(1, 5)
        new_lvl = int((((xp+xp_to_add)//42) ** 0.55))
        res = db.execute("UPDATE levels SET exp = exp + ?, lvl = ? WHERE user_id = ? AND guild_id = ?",
                         xp_to_add, new_lvl, message.author.id, message.author.guild.id)
        db.commit()
        if new_lvl > lvl:
            levelup_config = await LevelUpConfig.filter(
                guild_id=message.guild.id
            ).get_or_none()
            send_channel = discord.utils.get(
                message.guild.channels, id=levelup_config.channel_id)
            msg = levelup_config.message.format(
                mention=message.author.mention, level=(lvl+1))

            await send_channel.send(msg)

            await self.check_lvl_rewards(message, new_lvl, send_channel)

    async def check_lvl_rewards(self, message, lvl, levelup_channel):
        role1 = db.record(
            f"SELECT role1 FROM roles WHERE guild_id = {message.author.guild.id}")
        role2 = db.record(
            f"SELECT role2 FROM roles WHERE guild_id = {message.author.guild.id}")
        role3 = db.record(
            f"SELECT role3 FROM roles WHERE guild_id = {message.author.guild.id}")
        role4 = db.record(
            f"SELECT role4 FROM roles WHERE guild_id = {message.author.guild.id}")
        role5 = db.record(
            f"SELECT role5 FROM roles WHERE guild_id = {message.author.guild.id}")
        if role5 and role4 and role3 and role2 and role1 is not None:
            if 25 <= lvl < 30:  # PRO
                if (new_role := message.guild.get_role(int(role5[0]))) not in message.author.roles:
                    await message.author.add_roles(new_role)
                    # VET
                    await message.author.remove_roles(message.guild.get_role(role4[0]))
                    # ORO
                    await message.author.remove_roles(message.guild.get_role(role3[0]))
                    # ARGENTO
                    await message.author.remove_roles(message.guild.get_role(int(role2[0])))
                    # BRONZO
                    await message.author.remove_roles(message.guild.get_role(int(role1[0])))
                    await levelup_channel.send(f'Congrats {message.author.mention} you get a new role. {new_role.name}')
            elif 20 <= lvl < 25:  # VETERANO
                if(new_role := message.guild.get_role(role4[0])) not in message.author.roles:
                    await message.author.add_roles(new_role)
                    # ORO
                    await message.author.remove_roles(message.guild.get_role(role3[0]))
                    # BRONZO
                    await message.author.remove_roles(message.guild.get_role(int(role1[0])))
                    await levelup_channel.send(f'Congrats {message.author.mention} you get a new role. {new_role.name}')
            elif 15 <= lvl < 20:  # ORO
                if (new_role := message.guild.get_role(int(role3[0]))) not in message.author.roles:
                    await message.author.add_roles(new_role)
                    # VET
                    await message.author.remove_roles(message.guild.get_role(role4[0]))
                    # ARGENTO
                    await message.author.remove_roles(message.guild.get_role(int(role2[0])))
                    # BRONZO
                    await message.author.remove_roles(message.guild.get_role(int(role1[0])))
                    await levelup_channel.send(f'Congrats {message.author.mention} you get a new role. {new_role.name}')
            elif 10 <= lvl < 15:  # ARGENTO
                if (new_role := message.guild.get_role(int(role2[0]))) not in message.author.roles:
                    await message.author.add_roles(new_role)
                    # VET
                    await message.author.remove_roles(message.guild.get_role(int(role4[0])))
                    # ORO
                    await message.author.remove_roles(message.guild.get_role(int(role3[0])))
                    # BRONZO
                    await message.author.remove_roles(message.guild.get_role(int(role1[0])))
                    await levelup_channel.send(f'Congrats {message.author.mention} you get a new role. {new_role.name}')
            elif 5 <= lvl < 9:  # BRONZO
                if (new_role := message.guild.get_role(int(role1[0]))) not in message.author.roles:
                    await message.author.add_roles(new_role)
                    await levelup_channel.send(f'Congrats {message.author.mention} you get a new role. {new_role.name}')
        else:
            pass

    @commands.Cog.listener()
    async def on_message(self, message):
        if message.author.bot:
            return
        else:
            config = await GuildConfig.filter(id=message.guild.id).get_or_none()
            if not config:
                return
            if config.level_up_enabled:
                result = db.record(
                    f"SELECT guild_id AND user_id FROM levels WHERE guild_id = '{message.author.guild.id}' AND user_id = '{message.author.id}'")
                if result is None:
                    db.execute("INSERT INTO levels (guild_id, user_id, exp, lvl) VALUES (?,?,?,?)",
                               message.author.guild.id, message.author.id, 10, 0)
                    db.commit()
                elif result is not None:
                    xp, lvl = db.record(
                        f"SELECT exp, lvl FROM levels WHERE guild_id = '{message.author.guild.id}' AND user_id = '{message.author.id}'")
                    await self.add_xp(message, xp, lvl)

    @commands.command(aliases=['exp', 'xp', 'lvl', 'level'], help="See the level and the rank")
    async def rank(self, ctx, user: discord.Member = None):
        config = await GuildConfig.filter(id=ctx.guild.id).get_or_none()
        if not config.level_up_enabled:
            return await ctx.send('Levelling system plugin not enabled. Please contact a mod.')
        if config.level_up_enabled:
            if user is None:
                user = ctx.author
            ans = db.record(
                f"SELECT user_id, exp, lvl FROM levels WHERE user_id = '{user.id}' AND guild_id = '{user.guild.id}'")
            if ans is None:
                embed = discord.Embed(
                    title="You haven't sended messages yet, for the rank you need at least to send one message!!", colour=user.colour)
                await ctx.channel.send(embed=embed)
            else:
                xp = int(ans[1])
                lvl = int(ans[2])
                ids = db.column(
                    f"SELECT user_id FROM levels WHERE guild_id = '{user.guild.id}' ORDER BY exp DESC")
                rank = (ids.index(user.id)+1)
                embed = discord.Embed(title="STATS", colour=user.colour)
                embed.add_field(name="NAME", value=user.mention, inline=False)
                embed.add_field(name="XP", value=f"{xp}", inline=True)
                embed.add_field(name="LEVEL", value=f"{lvl}", inline=True)
                embed.add_field(
                    name="RANK", value=f"{rank}/{user.guild.member_count}", inline=True)
                embed.set_thumbnail(url=user.avatar_url)
                await ctx.channel.send(embed=embed)

    @command(name="leaderboard", help="Shows the leaderboard of the server based on the XP")
    async def display_leaderboard(self, ctx):
        config = await GuildConfig.filter(id=ctx.guild.id).get_or_none()
        if not config.level_up_enabled:
            return await ctx.send('Levelling system plugin not enabled. Please contact a mod.')
        if config.level_up_enabled:
            # records = db.records(
            #    f"SELECT user_id, exp, lvl FROM levels WHERE guild_id = '{ctx.guild.id}' ORDER BY exp DESC")

            # menu = MenuPages(source=HelpMenu(ctx, records),
            # clear_reactions_after=True,
            # timeout=60.0)
            # await menu.start(ctx)
            row = ActionRow(
                Button(style=ButtonStyle.link, label=f"{ctx.guild.name} Leaderboard",
                       url=f"https://xgnbot.xyz/leaderboard/{ctx.guild.id}")
            )
            await ctx.send("Ok, you got it.", components=[row])

    @slash_command(name="rank", description="See the level and the rank", options=[
        Option("user", "mention the user to see his rank", OptionType.USER)
    ])
    async def _rank(self, ctx, user: discord.Member = None):
        config = await GuildConfig.filter(id=ctx.guild.id).get_or_none()
        if not config.level_up_enabled:
            return await ctx.send('Levelling system plugin not enabled. Please contact a mod.')
        if config.level_up_enabled:
            if user is None:
                user = ctx.author
            ans = db.record(
                f"SELECT user_id, exp, lvl FROM levels WHERE user_id = '{user.id}' AND guild_id = '{user.guild.id}'")
            if ans is None:
                embed = discord.Embed(
                    title="You haven't sended messages yet, for the rank you need at least to send one message!!", colour=user.colour)
                await ctx.channel.send(embed=embed)
            else:
                xp = int(ans[1])
                lvl = int(ans[2])
                ids = db.column(
                    f"SELECT user_id FROM levels WHERE guild_id = '{user.guild.id}' ORDER BY exp DESC")
                rank = (ids.index(user.id)+1)
                embed = discord.Embed(title="STATS", colour=user.colour)
                embed.add_field(name="NAME", value=user.mention, inline=False)
                embed.add_field(name="XP", value=f"{xp}", inline=True)
                embed.add_field(name="LEVEL", value=f"{lvl}", inline=True)
                embed.add_field(
                    name="RANK", value=f"{rank}/{user.guild.member_count}", inline=True)
                embed.set_thumbnail(url=user.avatar_url)
                await ctx.channel.send(embed=embed)

    @slash_command(name="leaderboard", description="Shows the leaderboard of the server based on the XP")
    async def _display_leaderboard(self, ctx):
        config = await GuildConfig.filter(id=ctx.guild.id).get_or_none()
        if not config.level_up_enabled:
            return await ctx.send('Levelling system plugin not enabled. Please contact a mod.')
        if config.level_up_enabled:
            # records = db.records(
            #    f"SELECT user_id, exp, lvl FROM levels WHERE guild_id = '{ctx.guild.id}' ORDER BY exp DESC")

            # menu = MenuPages(source=HelpMenu(ctx, records),
            # clear_reactions_after=True,
            # timeout=60.0)
            # await menu.start(ctx)
            row = ActionRow(
                Button(style=ButtonStyle.link, label=f"{ctx.guild.name} Leaderboard",
                       url=f"https://xgnbot.xyz/leaderboard/{ctx.guild.id}")
            )
            await ctx.send("Ok, you got it.", components=[row])


def setup(bot):
    bot.add_cog(LvlCog(bot))
