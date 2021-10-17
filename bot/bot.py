import json
from asyncio import sleep
from glob import glob

import discord
from apscheduler.schedulers.asyncio import AsyncIOScheduler
from discord.ext import commands
from discord_slash import SlashCommand
from dislash import InteractionClient
from tortoise import Tortoise

import constants
from models import GuildConfig

COGS = [path.split("\\")[-1][:-3] for path in glob("./cogs/*.py")]


async def connect_db():
    await Tortoise.init(
        db_url=f"postgres://xgnbot:12345@207.180.214.184:5432/bot",
        modules={"models": ["models"]},
    )
    await Tortoise.generate_schemas()
    print("db connected")


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
            print(f"{cog} loaded")
        print("Setup completed")

    def run(self):
        print("Running setup...")
        self.setup()

        f = open("../data/config.json")
        data = json.load(f)
        token = data["TOKEN"]
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
        await connect_db()
        print(f" Connected to Discord (latency: {self.latency*1000:,.0f} ms).")

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


# launcher.py

bot = XGNbot()
slash = SlashCommand(bot, sync_commands=True, sync_on_cog_reload=True)
components = InteractionClient(bot)


def main():
    bot.run()


if __name__ == '__main__':
    main()
