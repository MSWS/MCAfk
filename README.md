# MCAfk

A simple discord bot that uses mineflayer to connect to a minecraft server and relays chat messages to a discord channel.

## Installation
1. Copy the `docker-compose.yml` file to a directory of your choice.
2. Edit the `docker-compose.yml` file and change the environment variables to your liking.
3. Create a `.env` file and specify the `DISCORD_TOKEN` (bot token) and `DISCORD_AUTHOR` (your discord user id) environment variables. <br> Eg:
```yml
DISCORD_TOKEN=NjQ5MDAxMTIzNjMwMzI4MTkx.RUha1l.fnOZe1JDgH6NvGWT3k97mM-UXa5
DISCORD_AUTHOR=847321766123215922
```

4. Run `docker compose up -d`