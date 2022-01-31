import discord
from discord.errors import Forbidden
from discord.ext import commands
from dislash import (Option, slash_command)


def syntax(command):
    cmd_and_aliases = "|".join([str(command), *command.aliases])
    params = []

    for key, value in command.params.items():
        if key not in ("self", "ctx"):
            params.append(f"[{key}]" if "NoneType" in str(
                value) else f"<{key}>")

    params = " ".join(params)

    return f"`{cmd_and_aliases} {params}`"


async def send_embed(ctx, embed):
    try:
        await ctx.send(embed=embed)
    except Forbidden:
        try:
            await ctx.send("Hey, seems like I can't send embeds. Please check my permissions :)")
        except Forbidden:
            await ctx.author.send(
                f"Hey, seems like I can't send any message in {ctx.channel.name} on {ctx.guild.name}\n"
                f"May you inform the server team about this issue? :slight_smile: ", embed=embed)


class Help(commands.Cog, name="help"):
    """
    Shows this message.
    """

    def __init__(self, bot):
        self.bot = bot
        self.bot.remove_command("help")

    @commands.command()
    async def help(self, ctx, *input):
        if not input:
            emb = discord.Embed(title='Commands and modules',
                                color=ctx.author.color,
                                url="http://discord.gg/z68SpbzcE4",
                                description=f'Welcome to the XGN BOT help dialog!\nsupport: https://discord.gg/z68SpbzcE4\nUse `!help <module>` to gain more information about that module'
                                )

            cogs_desc = ''
            for cog in self.bot.cogs:
                cogs_desc += f'`{cog}` {self.bot.cogs[cog].__doc__}\n'

            emb.add_field(name='Modules', value=cogs_desc, inline=True)

            commands_desc = ''
            for command in self.bot.walk_commands():
                if not command.cog_name and not command.hidden:
                    commands_desc += f'{syntax(command)} - {command.help}\n'

            if commands_desc:
                emb.add_field(name='Not belonging to a module',
                              value=commands_desc, inline=False)

        elif len(input) == 1:

            for cog in self.bot.cogs:
                if cog.lower() == input[0].lower():
                    emb = discord.Embed(title=f'{cog} - Commands', description=self.bot.cogs[cog].__doc__,
                                        color=ctx.author.color)

                    for command in self.bot.get_cog(cog).get_commands():
                        # if cog is not hidden
                        if not command.hidden:
                            emb.add_field(name=syntax(command),
                                          value=command.help, inline=False)
                    break

            else:
                emb = discord.Embed(title="What's that?!",
                                    description=f"I've never heard from a module called `{input[0]}` before :scream:",
                                    color=ctx.author.color)

        elif len(input) > 1:
            emb = discord.Embed(title="That's too much.",
                                description="Please request only one module at once :sweat_smile:",
                                color=discord.Color.orange())

        await send_embed(ctx, emb)

    @slash_command(name="help", description="Send all the bot commands", options=[
        Option("module", "select the module that you need help on")
    ])
    async def _help(self, ctx, module: str = None):
        if not module:
            emb = discord.Embed(title='Commands and modules',
                                color=ctx.author.color,
                                url="http://discord.gg/z68SpbzcE4",
                                description=f'Welcome to the XGN BOT help dialog!\nsupport: https://discord.gg/z68SpbzcE4\nUse `!help <module>` to gain more information about that module'
                                )

            cogs_desc = ''
            for cog in self.bot.cogs:
                cogs_desc += f'`{cog}` {self.bot.cogs[cog].__doc__}\n'

            emb.add_field(name='Modules', value=cogs_desc, inline=True)

            commands_desc = ''
            for command in self.bot.walk_commands():
                if not command.cog_name and not command.hidden:
                    commands_desc += f'{syntax(command)} - {command.help}\n'

            if commands_desc:
                emb.add_field(name='Not belonging to a module',
                              value=commands_desc, inline=False)

        else:

            for cog in self.bot.cogs:
                if cog.lower() == module.lower():
                    emb = discord.Embed(title=f'{cog} - Commands', description=self.bot.cogs[cog].__doc__,
                                        color=ctx.author.color)

                    for command in self.bot.get_cog(cog).get_commands():
                        # if cog is not hidden
                        if not command.hidden:
                            emb.add_field(name=syntax(command),
                                          value=command.help, inline=False)
                    break

            else:
                emb = discord.Embed(title="What's that?!",
                                    description=f"I've never heard from a module called `{module}` before :scream:",
                                    color=ctx.author.color)

        await send_embed(ctx, emb)


def setup(bot):
    bot.add_cog(Help(bot))
