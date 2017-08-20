module.exports = {
  /**
   * Split out a chat command that starts with `!`.
   */
  splitChatCommand: (message) => {
    const split = message.indexOf(' ');

    if (!split || !message.startsWith('!')) {
      return false;
    }

    return {
      name: message.substr(0, split),
      param: message.substr(split + 1).trim()
    };
  }
};
