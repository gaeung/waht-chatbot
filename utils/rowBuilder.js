const { ActionRowBuilder, StringSelectMenuBuilder } = require('discord.js');

//'waht events' 명령어 이후 event list 선택을 위한 row builder

const rowBuilder = (list) => {
  const row = new ActionRowBuilder().addComponents(
    new StringSelectMenuBuilder()
      .setCustomId('select')
      .setPlaceholder('Event Details & RSVP')
      .addOptions(...list)
  );
  return row;
};

module.exports = {
  rowBuilder,
};
