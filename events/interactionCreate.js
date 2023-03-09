const { Events } = require('discord.js');
const { selectEvent } = require('../services/selectEvent');
const { buttonEvent } = require('../services/buttonEvent');
const log = require('../config/logger');

module.exports = {
  name: Events.InteractionCreate,
  async execute(interaction) {
    if (interaction.isStringSelectMenu()) {
      await selectEvent(interaction);
    }
    if (interaction.isButton()) {
      await buttonEvent(interaction);
    }
    if (!interaction.isChatInputCommand()) return;

    const command = interaction.client.commands.get(interaction.commandName);

    if (!command) {
      log.error(`No command matching ${interaction.commandName} was found.`);
      return;
    }

    try {
      await command.execute(interaction);
    } catch (error) {
      log.error(`Error executing ${interaction.commandName}`);
      log.error(error);
    }
  },
};
