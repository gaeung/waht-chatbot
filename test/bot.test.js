const { client, loadCommands } = require('../app');
require('dotenv').config();
const path = require('node:path');
const fs = require('node:fs');
const log = require('../config/logger');

describe('Discord Bot', () => {
  beforeAll(async () => {
    await client.login(process.env.TOKEN);
  });

  afterAll(async () => {
    await client.removeAllListeners();
    await client.destroy();
  });

  test('Bot logs in successfully', async () => {
    await new Promise((resolve) => {
      client.once('ready', () => {
        resolve();
      });
    });

    expect(client.user).toBeDefined();
    expect(client.user.bot).toBe(true);
  });

  describe('Commands', () => {
    test('Missing required properties in command file should log an error', () => {
      const errorMock = jest.spyOn(log, 'error').mockImplementation();

      client.commands.clear();

      const invalidCommandFile = 'invalidCommand.js';
      const invalidCommandFilePath = path.join(
        __dirname,
        '../commands',
        invalidCommandFile
      );
      fs.writeFileSync(
        invalidCommandFilePath,
        'module.exports = { name: "invalid", description: "This command is invalid" };'
      );

      loadCommands();

      expect(errorMock).toHaveBeenCalledWith(
        `[WARNING] The command at ${invalidCommandFilePath} is missing a required "data" or "execute" property.`
      );

      // Remove the invalid command file
      fs.unlinkSync(invalidCommandFilePath);
    });
  });

  test('/ping command should return "Pong!"', async () => {
    const interaction = {
      commandName: 'ping',
      reply: jest.fn(),
    };

    await client.commands.get('ping').execute(interaction);

    expect(interaction.reply).toHaveBeenCalledWith({
      content: 'Pong!',
      ephemeral: true,
    });
  });

  test('/server command testing"', async () => {
    const interaction = {
      commandName: 'test',
      reply: jest.fn(),
      guild: {
        name: 'test',
        memberCount: 'test',
      },
    };

    await client.commands.get('server').execute(interaction);

    expect(interaction.reply).toHaveBeenCalledWith({
      content: `This server is ${interaction.guild.name} and has ${interaction.guild.memberCount} members.`,
      ephemeral: true,
    });
  });

  test('/user command testing"', async () => {
    const interaction = {
      commandName: 'test',
      reply: jest.fn(),
      user: {
        username: 'test',
      },
      member: {
        joinedAt: 'test',
      },
    };

    await client.commands.get('user').execute(interaction);

    expect(interaction.reply).toHaveBeenCalledWith({
      content: `This command was run by ${interaction.user.username}, who joined on ${interaction.member.joinedAt}.`,
      ephemeral: true,
    });
  });
});
