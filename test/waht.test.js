const WalletConnect = require('@walletconnect/client').default;
const { execute } = require('../commands/waht');

jest.mock('@walletconnect/client'.default);

const { qrImageGenerator } = require('../utils/qrImageGenerator');
// jest.mock('../utils/qrImageGenerator');

const axios = require('axios');
jest.mock('axios');

const log = require('../config/logger');

describe('Testing Waht command', () => {
  afterEach(() => {
    jest.clearAllMocks();
  });
  test('waht check command works', async () => {
    const interaction = {
      commandName: 'waht',
      options: {
        getSubcommand: jest.fn().mockReturnValue('check'),
      },
      user: { id: '1234567890' },
      reply: jest.fn(),
    };
    axios.mockReturnValue({
      status: 200,
    });
    await execute(interaction);
    expect(interaction.reply).toHaveBeenCalledWith({
      content: `You are authenticated!`,
      ephemeral: true,
    });
  });

  test('waht events command not works because of unauthenticated', async () => {
    const interaction = {
      commandName: 'waht',
      options: {
        getSubcommand: jest.fn().mockReturnValue('events'),
      },
      user: { id: '1234567890' },
      createdTimestamp: Date.now(),
      deferReply: jest.fn(),
      editReply: jest.fn(),
    };

    axios.mockImplementation(() =>
      Promise.reject({ response: { status: 401 } })
    );
    await execute(interaction);
    expect(interaction.deferReply).toHaveBeenCalledWith({ ephemeral: true });
    expect(interaction.editReply).toHaveBeenCalledWith({
      content: `Please authenticate your account`,
    });
  });

  test('waht events command not works because of no smart contract address', async () => {
    const interaction = {
      commandName: 'waht',
      options: {
        getSubcommand: jest.fn().mockReturnValue('events'),
      },
      user: { id: '1234567890' },
      createdTimestamp: Date.now(),
      deferReply: jest.fn(),
      editReply: jest.fn(),
    };

    axios.mockImplementation(() =>
      Promise.reject({ response: { status: 404 } })
    );
    await execute(interaction);
    expect(interaction.deferReply).toHaveBeenCalledWith({ ephemeral: true });
    expect(interaction.editReply).toHaveBeenCalledWith({
      content: `Couldn't find a list of events that match your smart contract address.`,
    });
  });

  test('waht events command works', async () => {
    const interaction = {
      commandName: 'waht',
      options: {
        getSubcommand: jest.fn().mockReturnValue('events'),
      },
      user: { id: '1234567890' },
      createdTimestamp: Date.now(),
      deferReply: jest.fn(),
      editReply: jest.fn(),
    };

    axios.mockResolvedValue({
      status: 200,
      data: {
        data: [
          {
            start_time: '2023-03-08 00:00:00',
            end_time: '2023-03-08 00:15:00',
            event_name: 'test',
            host_name: 'Test',
            event_id: '12345',
          },
        ],
      },
    });

    await execute(interaction);
    expect(interaction.deferReply).toHaveBeenCalledWith({ ephemeral: true });
    expect(interaction.editReply).toBeCalledTimes(1);
  });

  test('waht events command not works because of exceptional data status ', async () => {
    const interaction = {
      commandName: 'waht',
      options: {
        getSubcommand: jest.fn().mockReturnValue('events'),
      },
      user: { id: '1234567890' },
      createdTimestamp: Date.now(),
      deferReply: jest.fn(),
      editReply: jest.fn(),
    };

    axios.mockResolvedValue({
      status: 201,
    });

    await execute(interaction);
    expect(interaction.deferReply).toHaveBeenCalledWith({ ephemeral: true });
    expect(interaction.editReply).toHaveBeenCalledWith({
      content: `You don't have any nfts.`,
    });
  });

  test('waht refresh command  works', async () => {
    const interaction = {
      commandName: 'waht',
      options: {
        getSubcommand: jest.fn().mockReturnValue('refresh'),
      },
      user: { id: '1234567890' },
      deferReply: jest.fn(),
      editReply: jest.fn(),
    };

    axios.mockResolvedValue({
      status: 200,
    });
    axios.patch.mockResolvedValue(true);
    await execute(interaction);
    expect(interaction.deferReply).toHaveBeenCalledWith({ ephemeral: true });
    expect(interaction.editReply).toHaveBeenCalledWith({
      content: 'Your NFT records have been updated',
    });
  });

  test('waht refresh command not works because of unknown errors', async () => {
    const interaction = {
      commandName: 'waht',
      options: {
        getSubcommand: jest.fn().mockReturnValue('refresh'),
      },
      user: { id: '1234567890' },
      deferReply: jest.fn(),
      editReply: jest.fn(),
    };

    const mockLog = jest.spyOn(log, 'error').mockImplementation();

    axios.mockResolvedValue({
      status: 200,
    });
    axios.patch.mockRejectedValue(new Error('ERROR'));

    await execute(interaction);
    expect(interaction.deferReply).toHaveBeenCalledWith({ ephemeral: true });
    expect(mockLog).toBeCalledTimes(1);
    expect(interaction.editReply).toHaveBeenCalledWith({
      content: `There was an error processing your request. Please try again later`,
    });
  });

  test('waht refresh command not works because of unauthenticated', async () => {
    const interaction = {
      commandName: 'waht',
      options: {
        getSubcommand: jest.fn().mockReturnValue('refresh'),
      },
      user: { id: '1234567890' },
      deferReply: jest.fn(),
      editReply: jest.fn(),
    };
    axios.mockImplementation(() =>
      Promise.reject({ response: { status: 401 } })
    );
    await execute(interaction);
    expect(interaction.deferReply).toHaveBeenCalledWith({ ephemeral: true });
    expect(interaction.editReply).toHaveBeenCalledWith({
      content: `Please authenticate your account`,
    });
  });

  test('waht rsvp command works', async () => {
    const interaction = {
      commandName: 'waht',
      options: {
        getSubcommand: jest.fn().mockReturnValue('rsvp'),
      },
      user: { id: '1234567890' },
      deferReply: jest.fn(),
      createdTimestamp: Date.now(),
      editReply: jest.fn(),
    };
    axios.mockResolvedValue({
      status: 200,
      data: {
        list: [
          {
            start_time: '2023-03-08 00:00:00',
            end_time: '2023-03-08 00:15:00',
            event_name: 'test',
            host_name: 'Test',
            event_id: '12345',
          },
        ],
      },
    });
    await execute(interaction);
    expect(interaction.deferReply).toHaveBeenCalledWith({ ephemeral: true });
    expect(interaction.editReply).toBeCalledTimes(1);
  });

  test('waht rsvp command not works because no records', async () => {
    const interaction = {
      commandName: 'waht',
      options: {
        getSubcommand: jest.fn().mockReturnValue('rsvp'),
      },
      user: { id: '1234567890' },
      deferReply: jest.fn(),
      createdTimestamp: Date.now(),
      editReply: jest.fn(),
    };
    axios.mockResolvedValue({
      status: 204,
    });
    await execute(interaction);
    expect(interaction.deferReply).toHaveBeenCalledWith({ ephemeral: true });
    expect(interaction.editReply).toBeCalledTimes(1);
  });

  test('waht rsvp command not works because of unauthenticated', async () => {
    const interaction = {
      commandName: 'waht',
      options: {
        getSubcommand: jest.fn().mockReturnValue('rsvp'),
      },
      user: { id: '1234567890' },
      deferReply: jest.fn(),
      editReply: jest.fn(),
    };
    axios.mockImplementation(() =>
      Promise.reject({ response: { status: 401 } })
    );
    await execute(interaction);
    expect(interaction.deferReply).toHaveBeenCalledWith({ ephemeral: true });
    expect(interaction.editReply).toHaveBeenCalledWith({
      content: `Please authenticate your account`,
    });
  });

  test('waht rsvp command not works because of no RSVP', async () => {
    const interaction = {
      commandName: 'waht',
      options: {
        getSubcommand: jest.fn().mockReturnValue('rsvp'),
      },
      user: { id: '1234567890' },
      deferReply: jest.fn(),
      editReply: jest.fn(),
    };
    axios.mockImplementation(() =>
      Promise.reject({ response: { status: 404 } })
    );
    await execute(interaction);
    expect(interaction.deferReply).toHaveBeenCalledWith({ ephemeral: true });
    expect(interaction.editReply).toHaveBeenCalledWith({
      content: `You haven't RSVP'd to any events.`,
    });
  });

  describe('Testing Waht command', () => {
    test('waht check command works', async () => {
      const interaction = {
        commandName: 'waht',
        options: {
          getSubcommand: jest.fn().mockReturnValue('check'),
        },
        user: { id: '1234567890' },
        reply: jest.fn(),
        deleteReply: jest.fn(),
      };

      const walletAddress = '0x123';
      const client = {
        createSession: jest.fn(),
        sessionId: Math.floor(Math.random() * 1000000),
        uri: 'walletconnect:',
        on: jest.fn(),
        sendCustomRequest: jest.fn(() => Promise.resolve([walletAddress])),
        killSession: jest.fn(),
      };

      axios.mockImplementation(() =>
        Promise.reject({ response: { status: 401 } })
      );

      await execute(interaction);

      expect(interaction.reply).toHaveBeenCalledWith({
        content: expect.any(String),
        files: [{ attachment: expect.any(String), name: 'WalletConnect.png' }],
        ephemeral: true,
      });

      expect(axios.post).toHaveBeenCalledWith(
        `http://${process.env.SERVER_URL}/check?id=${interaction.user.id}`,
        {
          walletAddress: walletAddress,
        }
      );

      expect(interaction.followUp).toHaveBeenCalledWith({
        content: `You are now authenticated!`,
        ephemeral: true,
      });
    });
  });
});
