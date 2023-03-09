const createListFields = (list) => {
  let fields = [];
  list.map((ele) => {
    const field = {
      name: `
      • ${ele.event_name}`,
      value: `🗓️ Time: ${ele.startTime} - ${ele.endTime}
       🫅 Host: ${ele.host_name}`,
    };
    fields.push(field);
  });
  return fields;
};

const createRowFields = (list) => {
  let fields = [];
  list.map((ele) => {
    const field = {
      label: ele.event_name,
      value: ele.event_id,
    };
    fields.push(field);
  });
  return fields;
};

module.exports = {
  createListFields,
  createRowFields,
};
