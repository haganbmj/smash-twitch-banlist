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
      });
  }
};
