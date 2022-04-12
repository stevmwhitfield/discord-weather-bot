const { MongoClient } = require("mongodb");

const mongoClient = new MongoClient(process.env.MONGODB_URI);

module.exports = {
  name: "guildCreate",
  async execute(guild) {
    try {
      await mongoClient.connect();

      const db = mongoClient.db("guild-settings");
      const settings = db.collection("settings");

      settings.insertOne({
        guildId: guild.id,
        location: "Lakeland, Florida",
        lat: 28.0394654,
        lon: -81.9498042,
      });

      console.log("Joined a new guild: " + guild.name);
    } catch (err) {
      console.log(err);
    } finally {
      await mongoClient.close();
    }
  },
};
