const dotenv = require('dotenv');

dotenv.load();

module.exports = {
  options: {
    debug: process.env.TMI_DEBUG || false
  },
  connection: {
    reconnect: true
  },
  identity: {
    username: process.env.TMI_USERNAME,
    password: process.env.TMI_OAUTH
  },
  channels: [process.env.TMI_USERNAME] // Default channel to join.
};
