const dotenv = require('dotenv');
const TwitchBot = require('twitch-bot');

dotenv.load();

const channels = {};
const timeoutDuration = 24 /* Hours */ * 60 /* Minutes */ * 60 /* Seconds */;
let processedMessages = 0;

const bannedUsernames = require('./lib/tempData/bannedUsernames.js');
const adminUsernames = require('./lib/tempData/adminUsernames.js');
const channelNames = require('./lib/tempData/channelNames.js');

const connect = channel => {
  const bot = new TwitchBot({
    username: process.env.USERNAME,
    oauth: process.env.OAUTH,
    channel: channel
  });

  bindHandlers(bot);

  channels[bot.channel] = {
    channel: bot.channel,
    bot: bot
  };
};

const bindHandlers = bot => {
  bot.on('error', err => {
    console.log(err);
  });

  bot.on('join', () => {
    console.log(`Join > channel: ${bot.channel}`);
  });

  bot.on('message', onMessage);
};

const onMessage = chat => {
  processedMessages++;
  chat.lowercaseUsername = chat.username.toLowerCase();

  checkForChatCommand(chat);
  checkForBannedUsername(chat);
}

const checkForChatCommand = chat => {
  if (adminUsernames.includes(chat.lowercaseUsername)) {
    if (chat.message.startsWith('!smashban')) {
      // Convert all usernames to lowercase for comparisons.
      const userToBan = chat.message.replace('!smashban', '').trim().toLowerCase();

      if (!bannedUsernames.includes(userToBan)) {
        bannedUsernames.push(userToBan);
        console.log(`Ban list > ${userToBan} banned by user: ${chat.lowercaseUsername}, channel: ${chat.channel}`);
        channels[chat.channel].bot.say(`User ${userToBan} has been global banned.`);
      } else {
        channels[chat.channel].bot.say(`User ${userToBan} is already global banned.`);
      }
    }
  }
};

const checkForBannedUsername = chat => {
  if (bannedUsernames.includes(chat.lowercaseUsername)) {
    channels[chat.channel].bot.say(`/timeout ${chat.lowercaseUsername} ${timeoutDuration}`);
    console.log(`Time out > user: ${chat.lowercaseUsername}, channel: ${chat.channel}`);
  }
};

channelNames.forEach(name => {
  connect(name);
});
