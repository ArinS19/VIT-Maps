const mongoose = require("mongoose");
const dotenv = require("dotenv");
const Location = require("./models/locationModel");
const data = require("./data/locations.json");

dotenv.config();

mongoose.connect(process.env.MONGO_URI)
  .then(async () => {
    console.log("MongoDB Connected for Seeding...");

    // Clear existing data
    await Location.deleteMany();

    // Insert new data
    await Location.insertMany(data);

    console.log("Data Imported Successfully 🚀");
    process.exit();
  })
  .catch((err) => {
    console.error(err);
    process.exit(1);
  });