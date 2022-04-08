module.exports = {
  format_date: (date) => {
    // Format date as MM/DD/YYYY
    return date.toLocaleDateString();
  },

  ifEqual: (valueOne, valueTwo) => {
    return valueOne == valueTwo;
  },

  log: (item) => {
    return console.log(item);
  },

  split: (string) => {
    return string.split('-')[1];
  },
};
