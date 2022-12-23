const mongoose = require("mongoose");
const { DB_HOST } = require('../config.js');

mongoose.set('strictQuery', true);

const connectToMongo = async () => {
  return mongoose.connect(
    DB_HOST,
    {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    }
  );
};

module.exports = {
  connectToMongo,
};
