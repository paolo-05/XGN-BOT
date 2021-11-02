export interface User {
    id: string;
    username: string;
    discriminator: number;
    avatar_url: string;
    xp: string;
    lvl: string;
    counter: string;
}

export interface Status {
    users: number;
    guilds: number;
    ping: number;
}

export interface Guild {
    id: string;
    name: string;
    icon_url: string;
    in: boolean;
}
export interface Server {
    guild_id: string;
    name: string;
    icon_url: string;

    members: string
    people: string;
    bot_count: string;
    boost: string;
    text_channels: string;
    voice_channels: string;


    prefix: string;

    welcome_enabled: boolean;
    welcome_channel: string;
    welcome_message: string;

    leave_enabled: boolean;
    leave_channel: string;
    leave_message: string;

    level_up_enabled: boolean;
    level_channel: string;
    level_message: string;

    log_enabled: boolean;
    log_channel: string;
}
export interface Stats{
    enabled: boolean;
}

export interface TextChannel {
    id: string;
    name: string;
    guild_id: string;
}