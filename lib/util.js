module.exports = {
  /**
   * Split out a chat command that starts with `!`.
   */
  splitChatCommand: (message) => {
    if (!message.startsWith('!')) {
      return false;
    }

    const split = message.indexOf(' ');

    if (split === -1) {
      return {
        name: message,
        param: ''
      };
    }

    return {
      name: message.substr(0, split),
      param: message.substr(split + 1).trim()
    };
  }
};
