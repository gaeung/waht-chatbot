const { ActionRowBuilder, ButtonBuilder, ButtonStyle } = require('discord.js');

//RSVP 여부에 따라 달라지는 버튼
const checkButtonBuilder = async (id, rsvp) => {
  return new ButtonBuilder()
    .setCustomId(`RSVP_${id}`)
    .setLabel(rsvp ? `Thank you for your RSVP` : 'Click the button to RSVP')
    .setStyle(rsvp ? 'Success' : 'Danger')
    .setDisabled(rsvp);
};

//RSVP 후 QR Code 버튼
const ticketButtonBuilder = async (id) => {
  return new ButtonBuilder()
    .setCustomId(`Ticket_${id}`)
    .setLabel(`See QR Code Ticket`)
    .setStyle('Primary');
};

//waht.app 사이트 버튼
const visitWahtButton = new ActionRowBuilder().addComponents(
  new ButtonBuilder()
    .setURL('https://waht.app/event')
    .setLabel('Find more events in waht.app')
    .setStyle(ButtonStyle.Link)
);

//RSVP cancel 버튼
const cancelButtonBuilder = async (id) => {
  return new ButtonBuilder()
    .setCustomId(`Cancel_${id}`)
    .setLabel(`Click the button if you want to cancel RSVP`)
    .setStyle(`Danger`);
};

//RSVP Button builder
const rsvpButton = async (id, rsvp) => {
  const check = await checkButtonBuilder(id, rsvp);
  const ticket = await ticketButtonBuilder(id);
  const cancel = await cancelButtonBuilder(id);

  if (!rsvp) {
    return [new ActionRowBuilder().addComponents(check)];
  }

  const row1 = new ActionRowBuilder().addComponents(check, ticket);
  const row2 = new ActionRowBuilder().addComponents(cancel);
  return [row1, row2];
};

module.exports = {
  visitWahtButton,
  rsvpButton,
  checkButtonBuilder,
  ticketButtonBuilder,
  cancelButtonBuilder,
};
