const tmi = require('tmi.js');
const tmiOptions = require('./lib/tmiOptions');
const db = require('./lib/database');
const commands = require('./lib/commands');
const util = require('./lib/util');

const timeoutDuration = 24 /* Hours */ * 60 /* Minutes */ * 60 /* Seconds */;

const client = new tmi.client(tmiOptions);

client.on('chat', (channel, user, message) => {
  if (user.username === client.getUsername()) {
    return;
  }

  const userDbEntry = db.findUser(user.username) || {};
  channel = channel.replace('#', '');

  if (userDbEntry.isBanned) {
    timeoutUser(channel, user, message, userDbEntry);
  } else {
    const command = util.splitChatCommand(message);

    // Call the given command with a number of context variables.
    if (command && commands[command.name]) {
      commands[command.name]({
        client,
        channel,
        user,
        command,
        userDbEntry
      });
    }
  }
});

const timeoutUser = (channel, user, message, userDbEntry) => {
  const channelDbEntry = db.findChannel(channel);

  if (channelDbEntry && !channelDbEntry.exclusions.includes(userDbEntry.username)) {
    try {
      client.timeout(channel, userDbEntry.username, timeoutDuration, `User ${userDbEntry.username} is on the community banlist.`);
    } catch (err) {
      console.log(JSON.stringify(err));
      // TOOD: Check if this was due to lack of permissions and post in the channel if so.
      // TODO: Check usage_timeout issue.
    }
  }
};

const joinStoredChannels = () => {
  const channels = db.getCollection('channels').find({ active: true });

  channels.forEach(channel => {
    client.join(channel.name)
      .then(data => {
        console.log(`Join > channel: ${channel.name}`);
      })
      .catch(err => {
        console.log(`ERR > Failed to join channel: ${channel.name}`);
        channel.active = false;
      });
  });
}

client.connect()
  .then(() => {
    joinStoredChannels();
  })
  .catch(err => {
    console.log(err);
  });
