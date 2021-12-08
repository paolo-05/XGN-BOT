import json
from asyncio import sleep
from glob import glob

import discord
from apscheduler.schedulers.asyncio import AsyncIOScheduler
from discord.ext import commands
from dislash import InteractionClient, ContextMenuInteraction, ActionRow, Button, ButtonStyle, slash_command, Option, OptionType
from tortoise import Tortoise

import constants
from models import GuildConfig

COGS = [path.split("/")[-1][:-3] for path in glob("./cogs/*.py")]


async def connect_db():
    await Tortoise.init(
        db_url=f"postgres://xgnbot:12345@207.180.214.184:5432/bot",
        modules={"models": ["models"]},
    )
    await Tortoise.generate_schemas()
    print(" db connected")


async def get_prefix(bot: commands.Bot, message: discord.Message):
    config = await GuildConfig.filter(id=message.guild.id).get_or_none()
    return config.prefix if config else constants.DEFAULT_PREFIX


class Ready(object):
    def __init__(self):
        for cog in COGS:
            setattr(self, cog, False)

    def ready_up(self, cog):
        setattr(self, cog, True)
        print(f" {cog} cog ready")

    def all_ready(self):
        return all([getattr(self, cog) for cog in COGS])


class XGNbot(commands.Bot):
    def __init__(self):
        self.ready = False
        self.scheduler = AsyncIOScheduler()
        self.cogs_ready = Ready()
        super().__init__(command_prefix=get_prefix,
                         case_insensitive=True, intents=discord.Intents.all())

    def setup(self):
        for cog in COGS:
            self.load_extension(f"cogs.{cog}")
            print(f"  {cog} loaded")
        print(" Setup completed")

    def run(self):
        print(" Running setup...")
        self.setup()

        f = open("../data/config.json")
        data = json.load(f)
        token = data["TOKEN"]
        f.close()
        print("Running bot...")
        super().run(token, reconnect=True)

    async def shutdown(self):
        print("Closing connection to Discord and to postgres...")
        await Tortoise.close_connections()
        await super().close()

    async def close(self):
        print("Closing on keyboard interrupt...")
        await self.shutdown()

    async def on_connect(self):
        print(f" Connected to Discord (latency: {self.latency*1000:,.0f} ms).")
        await connect_db()

    async def on_resumed(self):
        print("Bot resumed.")

    async def on_disconnect(self):
        print("Bot disconnected.")

    async def on_ready(self):
        self.client_id = (await self.application_info()).id
        if not self.ready:
            self.scheduler.start()

            while not self.cogs_ready.all_ready():
                await sleep(0.5)

            self.ready = True
            print(" bot ready")

        else:
            print("bot reconnected")

    async def process_commands(self, msg):
        ctx = await self.get_context(msg, cls=commands.Context)

        if ctx.command is not None:
            await self.invoke(ctx)

    async def on_message(self, msg):
        if not msg.author.bot:
            await self.process_commands(msg)

        message = msg.content.split()

        if bot.user.mentioned_in(msg) and not ("@everyone" in message or "@here" in message):
            row = ActionRow(
                Button(style=ButtonStyle.link, label="Website",
                       url='https://xgnbot.xyz/'),
                Button(style=ButtonStyle.link, label="Server Dashboard",
                       url='https://xgnbot.xyz/guilds'),
                Button(style=ButtonStyle.link, label="Top.gg",
                       url='https://top.gg/bot/840300480382894080'),
                Button(style=ButtonStyle.link, label="Prime Bots ",
                       url='https://primebots.it/bots/840300480382894080'),
            )
            embed = discord.Embed(title="🤖 XGN BOT 🤖",
                                  description=f"👋 | Hi \n\n" +
                                  f"🧷 | my prefix here is `{await get_prefix(bot, msg)}`\n\n"
                                  + "🆘 | `!help` to see all the commands available",
                                  colour=0x00AAFF)
            embed.set_thumbnail(url=bot.user.avatar_url)
            await msg.reply(embed=embed, components=[row])


# launcher.py

bot = XGNbot()
components = InteractionClient(
    bot,  # test_guilds=[623571834469744701]
)


@components.user_command(name="Created at")
async def created_at(inter: ContextMenuInteraction):
    # User commands always have only this ^ argument
    await inter.respond(
        f"{inter.user} was created at {inter.user.created_at}",
        ephemeral=True  # Make the message visible only to the author
    )


def main():
    bot.run()


if __name__ == '__main__':
    main()
