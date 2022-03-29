module.exports = {
  format_date: (date) => {
    // Format date as MM/DD/YYYY
    return date.toLocaleDateString();
  },

  ifUser: (userId, commentId) => {
    return userId == commentId;
  },

  log: (item) => {
    return console.log(item);
  },
};
