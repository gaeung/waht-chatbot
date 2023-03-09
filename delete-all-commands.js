require('dotenv').config();
const { REST, Routes } = require('discord.js');
const log = require('./config/logger');

const rest = new REST({ version: '10' }).setToken(process.env.TOKEN);

rest
  .put(Routes.applicationCommands(process.env.CLIENT_ID), { body: [] })
  .then(() => log.info('Successfully deleted all application commands.'))
  .catch(log.error);
