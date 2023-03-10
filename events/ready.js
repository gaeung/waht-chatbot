const { Events } = require('discord.js');
const log = require('../config/logger');

module.exports = {
  name: Events.ClientReady,
  once: true,
  execute(client) {
    log.info(`Ready! Logged in as ${client.user.tag}`);
  },
};
