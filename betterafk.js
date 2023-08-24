import Discord, { ActivityType, GatewayIntentBits } from 'discord.js';
import Mineflayer from 'mineflayer';
import createRegistry from 'prismarine-registry';
import createChat from 'prismarine-chat';

const registry = createRegistry('1.20');
const ChatMessage = createChat(registry);
const { MessageBuilder } = createChat(registry);

import 'dotenv/config';

// Replace DISCORD_BOT_TOKEN with your bot's token
const discordClient = new Discord.Client({
    intents: [
        GatewayIntentBits.Guilds,
        GatewayIntentBits.GuildMessages,
        GatewayIntentBits.MessageContent
    ]
});

const CONNECT_OPTIONS = {
    host: process.env.MC_SERVER_IP,
    port: process.env.MC_SERVER_PORT ?? 25565,
    username: process.env.MC_EMAIL,
    auth: 'microsoft'
}

// Replace MINECRAFT_SERVER_IP and MINECRAFT_SERVER_PORT with the IP and port of the Minecraft server you want to connect to

// Replace DISCORD_CHANNEL_ID with the ID of the Discord channel you want the bot to listen to
const discordChannelId = process.env.DISCORD_CHANNEL;
const userId = process.env.DISCORD_AUTHOR;
let discordChannel;
let minecraftClient;
let lastConnect = 0;
let lastAttempt = 0;
let retryAttempts = 0;

discordClient.once('ready', async () => {
    console.log('Discord bot is ready!');

    // Find the Discord channel the bot should listen to
    discordChannel = await discordClient.channels.fetch(discordChannelId);
    startClient();

    // Listen for messages in the Discord channel
    discordClient.on('messageCreate', message => {
        // If the message was sent by the bot, ignore it
        if (message.author.id === discordClient.user.id || message.channel.id !== discordChannelId)
            return;
        if (message.author.id !== userId)
            return;
        if (message.content.startsWith('!')) {
            if (message.content.startsWith('!connect')) {
                startClient();
                message.react('✅');
                return;
            } else if (message.content.startsWith('!disconnect')) {
                minecraftClient.end();
                message.react('✅');
                return;
            }
            return;
        }
        try {
            message.delete();
        } catch (error) {
        }
        minecraftClient.chat(`${message.content}`);
    });
});

discordClient.on('error', (error) => {
    console.log(error);
});

process.on('unhandledRejection', error => {
    console.log(error);
});

// Connect the Discord bot to Discord
discordClient.login(process.env.DISCORD_TOKEN);

function startClient() {
    minecraftClient = Mineflayer.createBot(CONNECT_OPTIONS);
    minecraftClient.on('kicked', (reason, loggedIn) => {
        console.log(reason, loggedIn);
        discordChannel.send(`<@${userId}> Oops, I got kicked for \`${reason}\`!`);
        discordClient.user.setPresence({
            activities: [{
                name: reason,
                type: 'Playing'
            }],
            status: 'dnd'
        });
        if (reason.includes('You are not whitelisted on this server!') || reason.includes('You are banned from this server!'))
            return;
        if (reason.includes("You are already connected to this"))
            return;
        console.log('Attempting to reconnect due to kick');
        attemptReconnect();
    });

    minecraftClient.on('spawn', () => {
        discordClient.user.setPresence({
            activities: [{
                name: 'mine.edgegamers.com',
                type: ActivityType.Playing
            }],
            status: 'online'
        });
        discordChannel.send(`<@${userId}> Connected!`);
        console.log('Minecraft bot is ready!');
        lastConnect = Date.now();
        retryAttempts = 0;
    });

    minecraftClient.on('error', () => {
        console.log('Attempting to reconnect due to error');
        attemptReconnect();
    });

    minecraftClient.on('messagestr', async (msg, position, jsonMsg, sender) => {
        if (!discordChannel) {
            discordChannel = await discordClient.channels.fetch(discordChannelId);
        }
        if (!discordChannel) return;
        console.log(msg);
        console.log(jsonMsg);
        console.log(jsonMsg.toString());
        console.log(sender);
        msg = msg.trim();
        if (msg.length == 0)
            return;

        let mention = msg.toLowerCase().includes('ms');
        if (msg.toLowerCase().startsWith('ms') || msg.toLowerCase().startsWith('ms') || msg.toLowerCase().includes('=(eGO)= MS'))
            mention = false;
        let nameEnd = msg.indexOf('»');
        let nameStart = msg.toLowerCase().indexOf('ms');
        if (nameEnd !== -1 && nameStart !== -1) {
            if (nameStart < nameEnd)
                mention = false;
        }

        if(msg.length >= 4000)
            return;

        if (mention)
            discordChannel.send(`${msg} <@${userId}>`);
        else
            discordChannel.send(msg);
    });
}

function attemptReconnect() {
    if (Date.now() - lastAttempt < 10000)
        return;
    lastAttempt = Date.now();
    // Use exponential backoff to reconnect
    const nextConnect = Math.max(Math.pow(2, ++retryAttempts) * 10000, 30000);
    // discordChannel.send(`<@${userId}> Oops, I got disconnected! Reconnecting in ${nextConnect / 1000} seconds`);
    // Use discord's new timestamp format
    discordChannel.send(`<@${userId}> Oops, I got disconnected! Reconnecting <t:${Math.round((Date.now() + nextConnect) / 1000.0)}:R>`);
    console.log(`Reconnecting in ${nextConnect / 1000} seconds`);
    setTimeout(() => {
        startClient();
    }, nextConnect);
}