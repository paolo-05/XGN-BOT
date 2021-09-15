from tortoise.models import Model
from tortoise import fields


class GuildConfig(Model):
    id = fields.BigIntField(pk=True, unique=True, nullable=False)
    prefix = fields.TextField(default="!")
    welcome_enabled = fields.BooleanField(default=False)
    leave_enabled = fields.BooleanField(default=False)
    log_enabled = fields.BooleanField(default=False)
    level_up_enabled = fields.BooleanField(default=False)


class WelcomeConfig(Model):
    guild_id = fields.BigIntField(pk=True, unique=True, nullable=False)
    channel_id = fields.BigIntField()
    message = fields.TextField()


class LeaveConfig(Model):
    guild_id = fields.BigIntField(pk=True, unique=True, nullable=False)
    channel_id = fields.BigIntField()
    message = fields.TextField()


class LevelUpConfig(Model):
    guild_id = fields.BigIntField(pk=True, unique=True, nullable=False)
    channel_id = fields.BigIntField(nullable=False)
    message = fields.TextField()
    role1 = fields.BigIntField()
    role2 = fields.BigIntField()
    role3 = fields.BigIntField()
    role4 = fields.BigIntField()
    role5 = fields.BigIntField()


class LogChannel(Model):
    guild_id = fields.BigIntField(unique=True, nullable=False, pk=True)
    channel_id = fields.BigIntField()
