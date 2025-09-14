module.exports = ({ title, amount, category, date }) => {
  if (!title || !amount || !category || !date) {
    throw new Error('Title, amount, category and date are required');
  }
};
