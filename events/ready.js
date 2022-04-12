const mongoClient = require("../mongodb/dbConnect.js").client;

const updateGuilds = async (client, mongoClient) => {
  try {
    const db = mongoClient.db("guild-settings");
    const settings = db.collection("settings");

    client.guilds.cache.map(async (guild) => {
      settings.findOne({ guildId: guild.id }, (err, data) => {
        if (err) console.log(err);
        console.log(data);
      });
    });
  } catch (err) {
    console.log(err);
  }
};

module.exports = {
  name: "ready",
  once: true,
  async execute(client) {
    console.log(`Ready! Logged in as ${client.user.tag}`);
    // await updateGuilds(client, mongoClient);
  },
};
