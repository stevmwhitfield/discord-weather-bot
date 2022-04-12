const { MongoClient } = require("mongodb");

const mongoClient = new MongoClient(process.env.MONGODB_URI);

const updateGuilds = async (client) => {
  try {
    await mongoClient.connect();

    const db = mongoClient.db("guild-settings");
    const settings = db.collection("settings");

    settings.findOne({ guildId: "181487196740517889" }, (err, data) => {
      if (err) console.log(err);
      console.log(data);
    });
    // client.guilds.cache.map(async (guild) => {
    //   settings.findOne({ guildId: guild.id }, (err, data) => {
    //     if (err) console.log(err);
    //     console.log(data);
    //   });
    // });
  } catch (err) {
    console.log(err);
  } finally {
    await mongoClient.close();
  }
};

module.exports = {
  name: "ready",
  once: true,
  async execute(client) {
    console.log(`Ready! Logged in as ${client.user.tag}`);
    await updateGuilds(client);
  },
};
