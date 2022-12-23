const mongoose = require("mongoose");

const DB_HOST =
    "mongodb+srv://LeraPlo:kthf81064445@cluster0.at7hjhl.mongodb.net/db-contacts?retryWrites=true&w=majority";

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
