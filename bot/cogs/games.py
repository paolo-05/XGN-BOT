import asyncio
import random

import db
import discord
from discord.ext import commands
from dislash import ActionRow, Button, ButtonStyle, slash_command, Option, OptionType

GAME_XP = 250


class Games(commands.Cog, name="games"):
    """
    Commands for playing Games. Note: more you play at this games more xp you gain.
    """

    def __init__(self, bot):
        self.bot = bot

    def checkForWin(self, board):
        win = (
            board[0] == board[1] and board[1] == board[2]
            or board[3] == board[4] and board[4] == board[5]
            or board[6] == board[7] and board[7] == board[8]
            or board[0] == board[4] and board[4] == board[8]
            or board[2] == board[4] and board[4] == board[6]
        )
        if not any(i.isdigit() for i in board) and not win:
            return 2
        else:
            return win

    def getButtonStyle(self, value):
        if value == 'X':
            return ButtonStyle.blurple
        elif value == 'O':
            return ButtonStyle.red
        else:
            return ButtonStyle.gray

    async def game(self, ctx, user):

        components = list(
            ActionRow(
                *(Button(style=ButtonStyle.gray, label=str(ia+i), custom_id=f"ttt_button_{ia+i}") for ia in range(3))
            ) for i in range(1, 9, 3)
        )

        gamemsg = await ctx.send(f'{user.mention}, {ctx.author.name} has challenged thee to tic-tac-toe! You go first.', components=components)

        turn = 'X'
        players = {
            'X': user,
            'O': ctx.author
        }

        def checkEvent(event):

            component = event.component

            return (
                (component.label != 'X' and component.label != 'O')
                and event.message.id == gamemsg.id
                and (event.author == players[turn])
            )

        while True:

            click = await gamemsg.wait_for_button_click(check=checkEvent)

            moveComponent = click.component

            rows = click.components
            buttons = []
            for row in rows:
                buttons.extend(row.components)
            board = [button.label for button in buttons]

            squareClicked = board.index(moveComponent.label)

            board[squareClicked] = turn

            gameWon = self.checkForWin(board)

            components = list(
                ActionRow(
                    *(Button(style=self.getButtonStyle(board[i+ia-1]), label=board[i+ia-1], custom_id=f"ttt_button_{ia+i}", disabled=bool(gameWon)) for ia in range(3))
                ) for i in range(1, 9, 3)
            )

            if gameWon:
                if gameWon == 2:
                    await click.create_response(type=7, content=f'Game Over! It is a tie!', components=components)
                else:
                    await click.create_response(type=7, content=f'Game Over! {players[turn].mention} has won!', components=components)
                break

            if (turn == 'X'):
                turn = 'O'
            else:
                turn = "X"

            await click.create_response(type=7, content=f"It is {players[turn].mention}'s turn.", components=components)

    async def run_game(self, ctx, user):
        while not user:
            await ctx.send(f"{ctx.author.mention} please mention who you would like to play against.")
            reply = await self.bot.wait_for("message", check=lambda msg: msg.author == ctx.author)
            user = reply.mentions[0]
        if ctx.author == user:
            await ctx.send(f"{ctx.author.mention} You can't challenge yourself!")
            return
        if user.bot:
            await ctx.send(f"{ctx.author.mention} I don't think bot's know how to play tic-tac-toe...")
            return

        await self.game(ctx, user)

    @commands.command(help="starts a new game of tic-tac-toe")
    async def tictactoe(self, ctx, user: discord.Member = None):
        db.execute(
            f'UPDATE levels SET exp = exp + ? WHERE user_id = ? and guild_id = ?', GAME_XP, ctx.author.id, ctx.guild.id
        )
        db.commit()
        await Games(self.bot).run_game(ctx, user)

    @commands.command(name='rps', aliases=['rockpaperscissors'])
    async def rps(self, ctx):
        """play Rock, Paper, Scissors game"""
        db.execute(
            f'UPDATE levels SET exp = exp + ? WHERE user_id = ? AND guild_id = ?', GAME_XP, ctx.author.id, ctx.guild.id
        )
        db.commit()

        def check_win(p, b):
            if p == '🌑':
                return False if b == '📄' else True
            if p == '📄':
                return False if b == '✂' else True
            # p=='✂'
            return False if b == '🌑' else True

        async with ctx.typing():
            reactions = ['🌑', '📄', '✂']
            game_message = await ctx.send("**Rock Paper Scissors**\nChoose your shape:", delete_after=15.0)
            for reaction in reactions:
                await game_message.add_reaction(reaction)
            bot_emoji = random.choice(reactions)

        def check(reaction, user):
            return user != self.bot.user and user == ctx.author and (str(reaction.emoji) == '🌑' or '📄' or '✂')
        try:
            reaction, _ = await self.bot.wait_for('reaction_add', timeout=10.0, check=check)
        except asyncio.TimeoutError:
            await ctx.send("Time's Up! :stopwatch:")
        else:
            await ctx.send(f"**:man_in_tuxedo_tone1:\t{reaction.emoji}\n:robot:\t{bot_emoji}**")
            # if conds
            if str(reaction.emoji) == bot_emoji:
                await ctx.send("**It's a Tie :ribbon:**")
            elif check_win(str(reaction.emoji), bot_emoji):
                await ctx.send("**You win :sparkles:**")
            else:
                await ctx.send("**I win :robot:**")

    @slash_command(name="tictactoe", description="starts a new game of tic-tac-toe", options=[
        Option("user", "mention the user to play against",
               OptionType.USER, required=True)
    ])
    async def _tictactoe(self, ctx, user: discord.Member = None):
        db.execute(
            f'UPDATE levels SET exp = exp + ? WHERE user_id = ? and guild_id = ?', GAME_XP, ctx.author.id, ctx.guild.id
        )
        db.commit()
        await Games(self.bot).run_game(ctx, user)

    @slash_command(name='rps', description="play Rock, Paper, Scissors game")
    async def _rps(self, ctx):
        db.execute(
            f'UPDATE levels SET exp = exp + ? WHERE user_id = ? AND guild_id = ?', GAME_XP, ctx.author.id, ctx.guild.id
        )
        db.commit()

        def check_win(p, b):
            if p == '🌑':
                return False if b == '📄' else True
            if p == '📄':
                return False if b == '✂' else True
            # p=='✂'
            return False if b == '🌑' else True

        async with ctx.typing():
            reactions = ['🌑', '📄', '✂']
            game_message = await ctx.send("**Rock Paper Scissors**\nChoose your shape:", delete_after=15.0)
            for reaction in reactions:
                await game_message.add_reaction(reaction)
            bot_emoji = random.choice(reactions)

        def check(reaction, user):
            return user != self.bot.user and user == ctx.author and (str(reaction.emoji) == '🌑' or '📄' or '✂')
        try:
            reaction, _ = await self.bot.wait_for('reaction_add', timeout=10.0, check=check)
        except asyncio.TimeoutError:
            await ctx.send("Time's Up! :stopwatch:")
        else:
            await ctx.send(f"**:man_in_tuxedo_tone1:\t{reaction.emoji}\n:robot:\t{bot_emoji}**")
            # if conds
            if str(reaction.emoji) == bot_emoji:
                await ctx.send("**It's a Tie :ribbon:**")
            elif check_win(str(reaction.emoji), bot_emoji):
                await ctx.send("**You win :sparkles:**")
            else:
                await ctx.send("**I win :robot:**")


def setup(bot):
    bot.add_cog(Games(bot))
