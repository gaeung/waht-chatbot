const { EmbedBuilder } = require('discord.js');

//image는 무조건 URL이어야 합니다.
function checkUrl(strUrl) {
  let expUrl = /^http[s]?:\/\/([\S]{3,})/i;
  return expUrl.test(strUrl);
}

//event list에서 event 선택 후 event 상세 정보 보여주기
const detailEmbed = (data) => {
  const images = JSON.parse(data.images);
  const infos = JSON.parse(data.custom_info);
  const customInfos = [];

  for (let i = 0; i < infos.length; i++) {
    let obj = {
      name: `• Custom Information ${i + 1}`,
      value: `ℹ️ ${Object.values(infos[i])[0]} : ${Object.values(infos[i])[1]}`,
    };
    customInfos.push(obj);
  }

  const detailEmbed = new EmbedBuilder()
    .setColor(0x0099ff)
    .setTitle(data.event_name)
    .setAuthor({
      name: `🫅 Host: ${data.host_name}`,
    })
    .setDescription(data.description)
    .setThumbnail(`${process.env.WAHT_IMAGE}`)
    .setImage(
      checkUrl(images[0]) ? `${images[0]}` : `${process.env.WAHT_IMAGE}`
    )
    .addFields(
      {
        name: '• Time',
        value: `🕖 ${data.startTime} ~ ${data.endTime}`,
      },
      {
        name: '• Place',
        value: `📍 ${data.place}`,
      },
      ...(customInfos.length > 0 ? customInfos : [])
    )
    .setTimestamp();

  return detailEmbed;
};

module.exports = {
  detailEmbed,
};
