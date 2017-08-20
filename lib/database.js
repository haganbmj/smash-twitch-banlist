const loki = require('lokijs');

const dbInitialize = () => {
  const users = db.getCollection('users') || db.addCollection('users', { indices: ['username'], unique: 'username' });
  const channels = db.getCollection('channels') || db.addCollection('channels');
  console.log('Database initialized.');
};

const db = new loki('smashban.db', {
  autoload: true,
  autoloadCallback: dbInitialize,
  autosave: true,
  autosaveInterval: 5000
});

db.findUser = (username) => {
  username = username.toLowerCase();
  return db.getCollection('users').findOne({ username: username });
};

db.createOrUpdateUser = (user) => {
  user.username = user.username.toLowerCase();
  let userDbEntry = db.findUser(user.username);

  if (!userDbEntry) {
    userDbEntry = db.getCollection('users').insert({ username: user.username });
  }

  Object.keys(user).forEach(key => {
    userDbEntry[key] = user[key];
  });

  return userDbEntry;
};

db.findChannel = (channel) => {
  channel = channel.toLowerCase();
  return db.getCollection('channels').findOne({ name: channel });
};

db.findOrCreateChannel = (channel) => {
  channel = channel.toLowerCase();
  let channelDbEntry = db.findChannel(channel);

  if (!channelDbEntry) {
    channelDbEntry = db.getCollection('channels').insert({ name: channel, exclusions: [] });
  }

  return channelDbEntry;
};

module.exports = db;
