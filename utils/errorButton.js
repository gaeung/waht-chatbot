const { ActionRowBuilder, ButtonBuilder } = require('discord.js');

module.exports = {
  async errorButton(interaction) {
    await interaction.update({
      components: [
        new ActionRowBuilder().addComponents(
          new ButtonBuilder()
            .setCustomId(`Error`)
            .setLabel(`Something went wrong! Please try again`)
            .setStyle('Danger')
            .setDisabled(true)
        ),
      ],
    });
  },
};
