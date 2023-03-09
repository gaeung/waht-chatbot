const axios = require('axios');
const { detailEmbed } = require('../utils/detailEmbed');
const { visitWahtButton, rsvpButton } = require('../utils/rsvpButton');
const { changeTimeFormat } = require('../utils/convertTime');
const log = require('../config/logger');

//event list에서 event 선택 시 작업
module.exports = {
  async selectEvent(interaction) {
    const selected = interaction.values[0];

    if (!selected)
      await interaction.reply({
        content: 'Something went wrong',
        ephemeral: true,
      });

    try {
      const { data } = await axios(
        `http://${process.env.SERVER_URL}/events/detail?id=${interaction.user.id}&eventId=${selected}`
      );

      const converted = changeTimeFormat(data.result);

      const embed = detailEmbed(converted[0]);

      await interaction.reply({
        embeds: [embed],
        components: [
          ...(await rsvpButton(selected, data.check)),
          visitWahtButton,
        ],
        ephemeral: true,
      });
    } catch (err) {
      log.error(err);

      throw err;
    }
  },
};
