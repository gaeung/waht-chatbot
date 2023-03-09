const { SlashCommandBuilder } = require('discord.js');
const WalletConnect = require('@walletconnect/client').default;

const axios = require('axios');

const { changeToUTC, changeTimeFormat } = require('../utils/convertTime');
const { createListFields, createRowFields } = require('../utils/createFields');
const { listEmbed } = require('../utils/listEmbed');
const { rowBuilder } = require('../utils/rowBuilder');
const { visitWahtButton } = require('../utils/rsvpButton');
const { qrImageGenerator } = require('../utils/qrImageGenerator');
const log = require('../config/logger');

//user login 확인
const userCheck = async (interaction) => {
  try {
    const data = await axios(
      `http://${process.env.SERVER_URL}/check?id=${interaction.user.id}`
    );
    return data;
  } catch (err) {
    throw err;
  }
};

//"/waht check" 명령 시 실행 함수
const checkFunction = async (interaction) => {
  try {
    const data = await userCheck(interaction);

    if (data.status == 200) {
      await interaction.reply({
        content: `You are authenticated!`,
        ephemeral: true,
      });
    }
  } catch (err) {
    if (err.response.status == 401) {
      const client = new WalletConnect({
        bridge: 'https://bridge.walletconnect.org',
      });

      await client.createSession();

      client.on('session_update', async (error, payload) => {
        if (error) {
          log.error(error);
          throw error;
        }
        const { event } = payload;
        if (event === 'disconnected') {
          log.info('User disconnected');
          await client.killSession();
        }
      });

      const sessionId = Math.floor(Math.random() * 1000000);
      client.sessionId = sessionId;

      const uri = client.uri + '&sessionId=' + sessionId;

      await qrImageGenerator(uri, 'qrImage.png');

      await interaction.reply({
        content: `Please connect your wallet using this link:`,
        files: [{ attachment: './qrImage.png', name: 'WalletConnect.png' }],
        ephemeral: true,
      });

      await new Promise((resolve) => {
        client.on('connect', resolve);
      });

      await interaction.deleteReply();

      const accounts = await client.sendCustomRequest({
        method: 'eth_accounts',
        params: [],
      });

      //기존 qr code로 재인증 막기
      const checkAddress = [];

      await client.killSession();

      if (checkAddress.length == 0) {
        await checkAddress.push(accounts[0]);
        await axios
          .post(
            `http://${process.env.SERVER_URL}/check?id=${interaction.user.id}`,
            {
              walletAddress: accounts[0],
            }
          )
          .then(async (data) => {
            if (data.status == 201) {
              await interaction.followUp({
                content: `You are now authenticated!`,
                ephemeral: true,
              });
            }
          })
          .catch(async (err) => {
            log.error(err);
            await interaction.followUp({
              content: `There was an error processing your request. Please try again later`,
              ephemeral: true,
            });
          });
      }
    }
  }
};

//"/waht events" 명령 시 실행 함수
const eventsFunction = async (interaction) => {
  await interaction.deferReply({ ephemeral: true });
  try {
    const data = await userCheck(interaction);

    if (data.status == 200) {
      const { data } = await axios(
        `http://${process.env.SERVER_URL}/events/list?id=${
          interaction.user.id
        }&timestamp=${changeToUTC(interaction.createdTimestamp)}`
      );

      const converted = changeTimeFormat(data.data);

      const fields = createListFields(converted);

      const rows = createRowFields(data.data);

      const result = rowBuilder(rows);

      const embed = listEmbed(fields, rows.length, `Events List For You`);

      await interaction.editReply({
        embeds: [embed],
        components: [result, visitWahtButton],
      });
    } else {
      await interaction.editReply({
        content: `You don't have any nfts.`,
      });
    }
  } catch (error) {
    if (error.response.status == 404) {
      await interaction.editReply({
        content: `Couldn't find a list of events that match your smart contract address.`,
      });
    }

    if (error.response.status == 401) {
      await interaction.editReply({
        content: `Please authenticate your account`,
      });
    }
  }
};

//"/waht refresh" 명령 시 실행 함수
const refreshFunction = async (interaction) => {
  await interaction.deferReply({ ephemeral: true });
  try {
    const data = await userCheck(interaction);

    if (data.status == 200) {
      await axios
        .patch(
          `http://${process.env.SERVER_URL}/check?id=${interaction.user.id}`
        )
        .then(
          await interaction.editReply({
            content: 'Your NFT records have been updated',
          })
        )
        .catch(async (err) => {
          log.error(err);
          await interaction.editReply({
            content: `There was an error processing your request. Please try again later`,
          });
        });
    }
  } catch (error) {
    if (error.response.status == 401) {
      await interaction.editReply({
        content: `Please authenticate your account`,
      });
    }
  }
};

//"/waht rsvp" 명령 시 실행 함수
const rsvpFunction = async (interaction) => {
  await interaction.deferReply({ ephemeral: true });
  try {
    const data = await userCheck(interaction);

    if (data.status == 200) {
      const { data } = await axios(
        `http://${process.env.SERVER_URL}/rsvp/list?id=${
          interaction.user.id
        }&timestamp=${changeToUTC(interaction.createdTimestamp)}`
      );

      const converted = changeTimeFormat(data.list);

      const fields = createListFields(converted);

      const rows = createRowFields(data.list);

      const result = rowBuilder(rows);

      const embed = listEmbed(fields, rows.length, `Event lists you RSVP'd`);

      await interaction.editReply({
        embeds: [embed],
        components: [result, visitWahtButton],
      });
    } else {
      await interaction.editReply({
        content: `You don't have any records.`,
      });
    }
  } catch (error) {
    if (error.response.status == 401) {
      await interaction.editReply({
        content: `Please authenticate your account`,
      });
    }

    if (error.response.status == 404) {
      await interaction.editReply({
        content: `You haven't RSVP'd to any events.`,
      });
    }
  }
};

module.exports = {
  data: new SlashCommandBuilder()
    .setName('waht')
    .setDescription('Using WAHT services')
    .addSubcommand((subcommand) =>
      subcommand.setName('check').setDescription('Check your authentication')
    )
    .addSubcommand((subcommand) =>
      subcommand
        .setName('events')
        .setDescription('Search events which suit you')
    )
    .addSubcommand((subcommand) =>
      subcommand.setName('refresh').setDescription('Updating your NFTs')
    )
    .addSubcommand((subcommand) =>
      subcommand.setName('rsvp').setDescription(`Show events which you RSVP'd`)
    ),
  async execute(interaction) {
    //"/waht check" 명령 시
    if (interaction.options.getSubcommand() === 'check') {
      await checkFunction(interaction);
    } else if (interaction.options.getSubcommand() === 'events') {
      //"/waht events " 명령 시
      await eventsFunction(interaction);
      //"waht refresh" 명령 시
    } else if (interaction.options.getSubcommand() === 'refresh') {
      await refreshFunction(interaction);
    } else if (interaction.options.getSubcommand() === 'rsvp') {
      await rsvpFunction(interaction);
    }
  },
};
