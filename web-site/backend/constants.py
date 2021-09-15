from urllib.parse import quote

CLIENT_ID = "840300480382894080"
CLIENT_SECRET = "Mx-QzoxHRybIxnTUh96SEP3_KG7Ns7kS"
BOT_TOKEN = "ODQwMzAwNDgwMzgyODk0MDgw.YJWMzg.Wz5JMqYySVKTxYUQhgQvgZikL_w"
BOT_API_URL = "https://xgnbot.xyz/botapi/"

REDIRECT_URI = "https://xgnbot.xyz/callback"
OAUTH_URI = f"https://discord.com/api/oauth2/authorize?client_id={CLIENT_ID}&redirect_uri={quote(REDIRECT_URI)}&response_type=code&scope=identify%20guilds%20relationships.read"
