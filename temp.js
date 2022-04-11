require("dotenv").config();
const { MongoClient } = require("mongodb");

const mongoClient = new MongoClient(process.env.MONGODB_URI);

const f = async () => {
  try {
    await mongoClient.connect();

    const db = mongoClient.db("guild-settings");
    const settings = db.collection("settings");
    const query = { guildId: "181487196740517889" };
    const cursor = settings.findOne(query, (err, data) => {
      if (err) throw err;
      console.log(data);
    });

    if ((await settings.countDocuments()) === 0) {
      console.log("No documents found!");
    }
  } catch (err) {
    console.log(err);
  } finally {
    await mongoClient.close();
  }
};

f();
