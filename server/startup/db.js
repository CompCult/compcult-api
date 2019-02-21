const mongoose = require('mongoose');
const config = require('config');

module.exports = () => {
  mongoose.connect(config.get('db'), { useNewUrlParser: true })
    .then(() => console.log(`Connected to ${config.get('db')}`))
    .catch(err =>
      console.log(`Error to connect on ${config.get('db')}`, err)
    );
};
