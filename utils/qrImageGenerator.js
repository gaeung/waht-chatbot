const qr = require('qr-image');
const fs = require('fs');

module.exports = {
  async qrImageGenerator(data, fileName) {
    const qrPng = await qr.image(`${data}`, { type: 'png' });
    await qrPng.pipe(await fs.createWriteStream(fileName));
  },
};
