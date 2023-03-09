const { buttonEvent } = require('../services/buttonEvent');
const { ActionRowBuilder } = require('discord.js');
const {
  checkButtonBuilder,
  ticketButtonBuilder,
  rsvpButton,
  cancelButtonBuilder,
} = require('../utils/rsvpButton');

const log = require('../config/logger');
const axios = require('axios');

jest.mock('axios');
describe('ButtonEvent Testing', () => {
  let mockInteraction;
  let mockLog;

  beforeEach(() => {
    mockInteraction = {
      update: jest.fn(),
      followUp: jest.fn(),
      deferUpdate: jest.fn(),
      message: {
        components: [
          new ActionRowBuilder().addComponents(
            checkButtonBuilder(10000000, true),
            ticketButtonBuilder(10000000)
          ),
          new ActionRowBuilder().addComponents(cancelButtonBuilder(10000000)),
          new ActionRowBuilder(),
        ],
      },
      user: { id: '1234567890' },
    };

    mockLog = jest.spyOn(log, 'error').mockImplementation();
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  test('RSVP button updates components on success', async () => {
    mockInteraction.customId = 'RSVP_10000000';
    axios.post.mockResolvedValue({
      status: 200,
      data: {},
    });

    await buttonEvent(mockInteraction);

    expect(axios.post).toHaveBeenCalledWith(
      'http://localhost:8000/rsvp?id=1234567890&eventId=10000000'
    );

    expect(mockInteraction.update).toBeCalledTimes(1);
  });

  test('RSVP button shows error button on error', async () => {
    mockInteraction.customId = 'RSVP_10000000';
    const error = new Error('Server error');
    axios.post.mockImplementation(() => Promise.reject(error));

    await buttonEvent(mockInteraction);

    expect(axios.post).toHaveBeenCalledWith(
      'http://localhost:8000/rsvp?id=1234567890&eventId=10000000'
    );

    expect(mockLog).toHaveBeenCalledWith(error);

    expect(mockInteraction.update).toBeCalledTimes(1);
  });

  test('Ticket button sends QR code on success', async () => {
    mockInteraction.customId = 'Ticket_10000000';
    axios.get.mockResolvedValue({
      status: 200,
      data: { qrKey: 'qrCodeKey' },
    });

    await buttonEvent(mockInteraction);

    expect(axios.get).toHaveBeenCalledWith(
      'http://localhost:8000/rsvp?id=1234567890&eventId=10000000'
    );

    expect(mockInteraction.deferUpdate).toHaveBeenCalled();

    expect(mockInteraction.followUp).toHaveBeenCalledWith({
      content: 'QR Code Ticket',
      ephemeral: true,
      files: [
        {
          attachment: './rsvpQrImage.png',
          name: 'RSVPQRCODEIMAGE.png',
        },
      ],
    });
  });

  test('Ticket button shows error button on error', async () => {
    mockInteraction.customId = 'Ticket_10000000';
    const error = new Error('Server error');
    axios.get.mockRejectedValue(error);

    await buttonEvent(mockInteraction);

    expect(axios.get).toHaveBeenCalledWith(
      'http://localhost:8000/rsvp?id=1234567890&eventId=10000000'
    );

    expect(mockLog).toBeCalledTimes(1);
  });

  test('Cancel button on success', async () => {
    mockInteraction.customId = 'Cancel_10000000';

    axios.delete.mockResolvedValue({
      status: 200,
      data: {},
    });

    await buttonEvent(mockInteraction);

    expect(axios.delete).toHaveBeenCalledWith(
      'http://localhost:8000/rsvp?id=1234567890&eventId=10000000'
    );

    expect(mockInteraction.update).toBeCalledTimes(1);
  });
  test('Cancel button shows error button on error', async () => {
    mockInteraction.customId = 'Cancel_10000000';
    const error = new Error('Server error');
    axios.delete.mockRejectedValue(error);

    await buttonEvent(mockInteraction);

    expect(axios.delete).toHaveBeenCalledWith(
      'http://localhost:8000/rsvp?id=1234567890&eventId=10000000'
    );

    expect(mockLog).toBeCalledTimes(1);
    expect(mockInteraction.update).toBeCalledTimes(1);
  });
});
