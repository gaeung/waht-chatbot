const axios = require('axios');
const { ActionRowBuilder } = require('discord.js');

const log = require('../config/logger');
const {
  checkButtonBuilder,
  ticketButtonBuilder,
  rsvpButton,
  cancelButtonBuilder,
} = require('../utils/rsvpButton');
const { errorButton } = require('../utils/errorButton');
const { qrImageGenerator } = require('../utils/qrImageGenerator');

const RSVP_BUTTON_PREFIX = 'RSVP_';
const TICKET_BUTTON_PREFIX = 'Ticket_';
const CANCEL_BUTTON_PREFIX = 'Cancel_';

const rsvpFunction = async (interaction) => {
  const id = parseInt(interaction.customId.split(RSVP_BUTTON_PREFIX)[1]);

  await axios
    .post(
      `http://${process.env.SERVER_URL}/rsvp?id=${interaction.user.id}&eventId=${id}`
    )
    .then(async (data) => {
      if (data.status == 200) {
        const { components } = interaction.message;

        const newCheckButton = await checkButtonBuilder(id, true);
        const newTicketButton = await ticketButtonBuilder(id);
        const newCancelButton = await cancelButtonBuilder(id);

        await interaction.update({
          components: [
            new ActionRowBuilder().addComponents(
              newCheckButton,
              newTicketButton
            ),
            new ActionRowBuilder().addComponents(newCancelButton),
            components[1],
          ],
        });
      }
    })
    .catch(async (err) => {
      log.error(err);
      await errorButton(interaction);
    });
};

const ticketFunction = async (interaction) => {
  const id = parseInt(interaction.customId.split(TICKET_BUTTON_PREFIX)[1]);

  await axios
    .get(
      `http://${process.env.SERVER_URL}/rsvp?id=${interaction.user.id}&eventId=${id}`
    )
    .then(async (data) => {
      if (data.status == 200) {
        await qrImageGenerator(
          JSON.stringify(data.data.qrKey),
          'rsvpQrImage.png'
        );

        await interaction.deferUpdate();
        await interaction.followUp({
          content: `QR Code Ticket`,
          files: [
            {
              attachment: './rsvpQrImage.png',
              name: 'RSVPQRCODEIMAGE.png',
            },
          ],
          ephemeral: true,
        });
      }
    })
    .catch(async (err) => {
      log.error(err);
      await errorButton(interaction);
    });
};

const cancelFunction = async (interaction) => {
  const id = parseInt(interaction.customId.split(CANCEL_BUTTON_PREFIX)[1]);

  await axios
    .delete(
      `http://${process.env.SERVER_URL}/rsvp?id=${interaction.user.id}&eventId=${id}`
    )
    .then(async (data) => {
      if (data.status == 200) {
        const { components } = interaction.message;

        await interaction.update({
          components: [...(await rsvpButton(id, false)), components[2]],
        });
      }
    })
    .catch(async (err) => {
      log.error(err);
      await errorButton(interaction);
    });
};

module.exports = {
  async buttonEvent(interaction) {
    try {
      //RSVP 버튼 클릭 시
      if (interaction.customId.startsWith(RSVP_BUTTON_PREFIX)) {
        await rsvpFunction(interaction);
      }

      //QR code 보기 버튼 클릭 시
      if (interaction.customId.startsWith(TICKET_BUTTON_PREFIX)) {
        await ticketFunction(interaction);
      }

      //RSVP 취소버튼 클릭 시
      if (interaction.customId.startsWith(CANCEL_BUTTON_PREFIX)) {
        await cancelFunction(interaction);
      }
    } catch (err) {
      log.error(err);
      throw err;
    }
  },
};
