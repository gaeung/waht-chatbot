const { time } = require('discord.js');

//UTC 시간 변경
const changeToUTC = (unixTimestamp) => {
  const date = new Date(unixTimestamp).toISOString();
  return date;
};

//UTC 시간 각자의 TIMEZONE에 맞게 변경
const changeTimeFormat = (list) => {
  let converted = [];
  list.map((ele) => {
    const start = ele.start_time;
    const end = ele.end_time;

    ele.startTime = time(new Date(start + 'Z'), 'f');
    ele.endTime = time(new Date(end + 'Z'), 'f');

    converted.push(ele);
  });
  return converted;
};

module.exports = {
  changeToUTC,
  changeTimeFormat,
};
