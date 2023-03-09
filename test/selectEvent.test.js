const { selectEvent } = require('../services/selectEvent');
const log = require('../config/logger');
const axios = require('axios');

jest.mock('axios');

describe('SelectEvent Testing', () => {
  let mockInteraction;
  let mockLog;

  beforeEach(() => {
    mockInteraction = {
      reply: jest.fn(),
      user: { id: '1234567890' },
    };

    mockLog = jest.spyOn(log, 'error').mockImplementation();
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  test('SelectEvent works well with image', async () => {
    mockInteraction.values = [true];
    axios.mockResolvedValue({
      status: 200,
      data: {
        result: [
          {
            start_time: '2023-03-08 00:00:00',
            end_time: '2023-03-08 00:15:00',
            event_name: 'test',
            host_name: 'Test',
            event_id: '12345',
            images: JSON.stringify([`${process.env.WAHT_IMAGE}`]),
            custom_info: JSON.stringify([['test', 'test']]),
            description: 'test',
          },
        ],

        check: true,
      },
    });
    await selectEvent(mockInteraction);
    expect(mockInteraction.reply).toBeCalledTimes(1);
  });

  test('SelectEvent works not well because of no values', async () => {
    mockInteraction.values = [false];
    axios.mockResolvedValue({
      status: 200,
      data: {
        result: [
          {
            start_time: '2023-03-08 00:00:00',
            end_time: '2023-03-08 00:15:00',
            event_name: 'test',
            host_name: 'Test',
            event_id: '12345',
            images: JSON.stringify(`${process.env.WAHT_IMAGE}`),
            custom_info: JSON.stringify([]),
            description: 'test',
          },
        ],

        check: true,
      },
    });
    await selectEvent(mockInteraction);
    expect(mockInteraction.reply).toHaveBeenCalledWith({
      content: 'Something went wrong',
      ephemeral: true,
    });
  });

  test('SelectEvent works not well because of no values', async () => {
    mockInteraction.values = [true];
    axios.mockImplementation(() =>
      Promise.reject({ response: { status: 500 } })
    );
    await expect(selectEvent(mockInteraction)).rejects.toEqual({
      response: { status: 500 },
    });
    expect(mockLog).toBeCalledTimes(1);
  });
});
