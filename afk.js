// const mineflayer = require('mineflayer');
import mineflayer from 'mineflayer';
import { sendMessage } from './webhook.js';
const WEB_URL = '[webhook]'

function start() {
  let startTime = 0

  const bot = mineflayer.createBot({
    host: '[ip]',
    // host: 'localhost',
    port: 25565,
    username: '[email]',
    auth: 'microsoft'
  });

  bot.on("message", (json, position, sender, verified) => {
    if (position == "chat")
      return;
    sendMessage(WEB_URL, {
      username: "System",
      content: json.toString()
    });
  });

  bot.on('chat', (username, message, translate, json, matches) => {
    if (username === bot.username) return;
    console.log(username, message);
    sendMessage(WEB_URL, {
      username: username,
      content: message
    });
    if (Date.now() - startTime > 10000) return;
    for (let str of ["wb", "welcome", "hi", "o/", "o>", "hello"]) {
      console.log("testing " + str);
      if (message.toLowerCase().includes(str)) {
        setTimeout(() => {
          bot.chat("o/");
        }, 1000);
        startTime = 0;
        break;
      }
    }
  });

  bot.on('kicked', (reason, loggedIn) => {
    console.log(reason, loggedIn);
    sendMessage(WEB_URL, {
      username: 'System',
      content: 'Oops, I got kicked for `' + reason + '`!'
    });
  });

  bot.on('error', (err) => {
    console.log(err);
    sendMessage(WEB_URL, {
      username: 'System',
      content: 'Oops, I an error!\n```' + err + '```'
    });
  });

  bot.on('login', () => {
    startTime = Date.now();
  });
}

start();