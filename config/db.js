const mongoose = require('mongoose');
const mongooseUniqueValidator = require('mongoose-unique-validator');

const connectDB = async () => {
  try {
    const conct = await mongoose.connect(process.env.MONGO_URI);
    console.log(`MongoDB Connected: ${conct.connection.host}`);
  } catch (err) {
    console.log(`Error ${err.message}`);
    process.exit(1);
  }
};

module.exports = connectDB;
