require("dotenv").config();
const { MongoClient } = require("mongodb");

const client = new MongoClient(process.env.MONGODB_URI);

try {
  client.connect();
} catch (err) {
  console.log(err);
}

module.exports = { client };
