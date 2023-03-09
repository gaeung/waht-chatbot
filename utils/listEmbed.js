const { EmbedBuilder } = require('discord.js');

//'/waht events' 명령어 이후 보여주는 event lists
const listEmbed = (fields, eventLength, title) => {
  const listEmbed = new EmbedBuilder()
    .setColor(0x0099ff)
    .setTitle(title)
    .setDescription(`There are ${eventLength} events`)
    .setThumbnail(`${process.env.WAHT_IMAGE}`)
    .addFields(...fields)
    .setTimestamp();

  return listEmbed;
};

module.exports = {
  listEmbed,
};
