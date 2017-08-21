const db = require('./database');

module.exports = {
  /**
   * Adds a new user to the shared banlist.
   */
  '!smashban': event => {
    if (!event.userDbEntry.isAdmin) {
      return;
    }

    const targetUser = db.findUser(event.command.param);

    if (targetUser && targetUser.isAdmin) {
      event.client.say(event.channel, `User ${event.command.param} is a registered Admin and cannot be banned.`);
      return;
    }

    db.createOrUpdateUser({
      username: event.command.param,
      isBanned: true
    });

    console.log(`Ban > user: ${event.command.param}, by admin: ${event.userDbEntry.username}`);
  },

  /**
   * Removes a user from the shared banlist.
   */
  '!smashunban': event => {
    if (!event.userDbEntry.isAdmin) {
      return;
    }

    db.createOrUpdateUser({
      username: event.command.param,
      isBanned: false
    });

    console.log(`Unban > user: ${event.command.param}, by admin: ${event.userDbEntry.username}`);
  },

  /**
   * Adds a user to the shared administator list.
   */
  '!smashadmin': event => {
    if (!event.userDbEntry.isAdmin) {
      return;
    }

    db.createOrUpdateUser({
      username: event.command.param,
      isAdmin: true
    });

    console.log(`Admin > user: ${event.command.param}, by admin: ${event.userDbEntry.username}`);
  },

  /**
   * Removes a user from the shared administrator list.
   */
  '!smashunadmin': event => {
    if (!event.userDbEntry.isAdmin) {
      return;
    }

    db.createOrUpdateUser({
      username: event.command.param,
      isAdmin: false
    });

    console.log(`Unadmin > user: ${event.command.param}, by admin: ${event.userDbEntry.username}`);
  },

  /**
   * Join a specified channel name.
   */
  '!smashjoin': event => {
    if (!event.userDbEntry.isAdmin) {
      return;
    }

    const channelDbEntry = db.findOrCreateChannel(event.command.param);
    channelDbEntry.active = true;

    event.client.join(channelDbEntry.name)
      .then(data => {
        console.log(`Join > channel: ${channelDbEntry.name}, by admin: ${event.userDbEntry.username}`);
      })
      .catch(err => {
        console.log(`ERR > Failed to join channel: ${channelDbEntry.name}`);
        channelDbEntry.active = false;
      });
  },

  '!join': event => {
    // Only acknowledge !join on the bot channel.
    if (!event.channel === event.client.getUsername().toLowerCase()) {
      return;
    }

    const channelDbEntry = db.findOrCreateChannel(event.user.username);
    channelDbEntry.active = true;

    event.client.join(channelDbEntry.name)
      .then(data => {
        console.log(`Join > channel: ${channelDbEntry.name}, by user: ${event.user.username}`);
        event.client.say(event.channel, `Joined channel ${channelDbEntry.name}. Please mod this bot there using the command /mod ${event.client.getUsername()}`);
      })
      .catch(err => {
        console.log(`ERR > Failed to join channel: ${channelDbEntry.name}`);
        channelDbEntry.active = false;
      });
  },

  '!smashpermit': event => {
    if (!event.user.mod && event.user.badges.broadcaster !== '1') {
      return;
    }

    const channelDbEntry = db.findChannel(event.channel);
    if (channelDbEntry) {
      // Add the name as an exclusion, unban the user from the channel to cancel any timeouts.
      channelDbEntry.exclusions.push(event.command.param.toLowerCase());
      console.log(`Permit > channel: ${event.channel}, username: ${event.command.param}, by user: ${event.user.username}`);
      event.client.unban(event.channel, event.command.param.toLowerCase())
        .then(data => {}).catch(err => {});
      event.client.say(event.channel, `User ${event.command.param} was added as an exclusion for this channel.`);
    }
  }
};
