const mongoose = require("mongoose");

module.exports.connect = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URL);
    console.log("Connected success!");
  } catch (error) {
    console.log("Error connecting to MongoDB", error);
  }
};

module.exports.connect();
