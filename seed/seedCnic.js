// backend/seed/seedCnic.js
require("dotenv").config();
const mongoose = require("mongoose");
const Cnic = require("../models/Cnic");

const MONGO = process.env.MONGO_URI;
if (!MONGO) {
  console.error(".env MONGO_URI missing");
  process.exit(1);
}

async function run() {
  try {
    await mongoose.connect(MONGO, { useNewUrlParser: true, useUnifiedTopology: true });
    console.log("Connected to Mongo");

    const sample = [];
    const cities = ["Lahore", "Karachi", "Islamabad", "Rawalpindi", "Multan"];
    const provinces = ["Punjab", "Sindh", "ICT", "Punjab", "Punjab"];
    const genders = ["male", "female"];
    for (let i = 0; i < 50; i++) {
      const fn = `TestFirst${i+1}`;
      const ln = `TestLast${i+1}`;
      const fullname = `${fn} ${ln}`;
      const year = 1980 + (i % 20);
      const month = String((i % 12) + 1).padStart(2, "0");
      const day = String((i % 28) + 1).padStart(2, "0");
      const dob = `${year}-${month}-${day}`;
      const cnicNumber = `${35202 + i}-${1000000 + i}-${1 + (i % 9)}`; // pseudo CNIC unique-ish
      const city = cities[i % cities.length];
      const province = provinces[i % provinces.length];
      const gender = genders[i % genders.length];
      const fathername = `Father${i+1}`;

      sample.push({
        firstname: fn,
        lastname: ln,
        fullname,
        dob,
        cnic: cnicNumber,
        fathername,
        gender,
        city,
        province
      });
    }

    // insertMany
    const res = await Cnic.insertMany(sample, { ordered: false });
    console.log("Inserted:", res.length);
    process.exit(0);
  } catch (err) {
    console.error("Seed error:", err.message);
    process.exit(1);
  }
}

run();
