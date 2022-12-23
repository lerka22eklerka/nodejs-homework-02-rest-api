const mongoose = require("mongoose");
const dotenv = require('dotenv');

dotenv.config()
const { DB_HOST } = process.env;

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
