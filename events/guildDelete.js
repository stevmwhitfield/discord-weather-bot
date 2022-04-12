const { MongoClient } = require("mongodb");

const mongoClient = new MongoClient(process.env.MONGODB_URI);

module.exports = {
  name: "guildDelete",
  async execute(guild) {
    if (guild.available) {
      try {
        await mongoClient.connect();

        const db = mongoClient.db("guild-settings");
        const settings = db.collection("settings");

        settings.deleteOne({ guildId: guild.id });

        console.log("Left a guild: " + guild.name);
      } catch (err) {
        console.log(err);
      } finally {
        await mongoClient.close();
      }
    } else {
      console.log("Left a guild (possible outage): " + guild.name);
    }
  },
};
