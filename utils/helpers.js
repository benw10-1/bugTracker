module.exports = {
  format_date: (date) => {
    // Format date as MM/DD/YYYY
    return date.toLocaleDateString();
  },

  ifEqual: (valueOne, valueTwo) => {
    return valueOne == valueTwo;
  },
  notEqual: (v1, v2) => v1 !== v2,
  log: (item) => {
    return console.log(item);
  },
};
