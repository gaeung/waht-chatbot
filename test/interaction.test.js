const interactionCreate = require('../events/interactionCreate');
const log = require('../config/logger');
const { selectEvent } = require('../services/selectEvent');
const { buttonEvent } = require('../services/buttonEvent');

jest.mock('../services/selectEvent', () => ({
  selectEvent: jest.fn(),
}));
jest.mock('../services/buttonEvent', () => ({
  buttonEvent: jest.fn(),
}));

describe('InteractionCreate event handler', () => {
  let mockInteraction;
  let mockCommand;
  let mockLog;

  beforeEach(() => {
    mockInteraction = {
      isChatInputCommand: jest.fn().mockReturnValue(true),
      isStringSelectMenu: jest.fn().mockReturnValue(false),
      isButton: jest.fn().mockReturnValue(false),
      commandName: 'mockCommand',
      options: new Map(),
      client: {
        commands: new Map(),
      },
    };

    mockCommand = {
      execute: jest.fn(),
    };

    mockInteraction.client.commands.set(
      mockInteraction.commandName,
      mockCommand
    );

    mockLog = jest.spyOn(log, 'error').mockImplementation();
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  test('should execute command on chat input', async () => {
    await interactionCreate.execute(mockInteraction);

    expect(mockCommand.execute).toHaveBeenCalledWith(mockInteraction);
    expect(mockLog).not.toHaveBeenCalled();
  });

  test('should not execute command on non-chat input', async () => {
    mockInteraction.isChatInputCommand.mockReturnValue(false);

    await interactionCreate.execute(mockInteraction);

    expect(mockCommand.execute).not.toHaveBeenCalledWith(mockInteraction);
    expect(mockLog).not.toHaveBeenCalled();
  });

  test('should log error when command is not found', async () => {
    mockInteraction.client.commands.delete(mockInteraction.commandName);

    await interactionCreate.execute(mockInteraction);

    expect(mockLog).toHaveBeenCalledWith(
      `No command matching ${mockInteraction.commandName} was found.`
    );
  });

  test('should log error when command execution fails', async () => {
    mockCommand = {
      execute: jest.fn(() => {
        throw new Error('Command execution error');
      }),
    };

    mockInteraction.client.commands.set(
      mockInteraction.commandName,
      mockCommand
    );

    await interactionCreate.execute(mockInteraction);

    expect(mockLog).toHaveBeenCalledWith(
      `Error executing ${mockInteraction.commandName}`
    );
    expect(mockLog).toHaveBeenCalledWith(new Error('Command execution error'));
  });

  test('test isStringMenu', async () => {
    mockInteraction.isStringSelectMenu.mockReturnValue(true);

    await interactionCreate.execute(mockInteraction);

    expect(selectEvent).toHaveBeenCalledWith(mockInteraction);
  });

  test('test isButton', async () => {
    mockInteraction.isButton.mockReturnValue(true);

    await interactionCreate.execute(mockInteraction);

    expect(buttonEvent).toHaveBeenCalledWith(mockInteraction);
  });
});
