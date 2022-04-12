const mongoClient = require("../mongodb/dbConnect.js").client;

module.exports = {
  name: "guildDelete",
  async execute(guild) {
    if (guild.available) {
      try {
        const db = mongoClient.db("guild-settings");
        const settings = db.collection("settings");

        settings.deleteOne({ guildId: guild.id });

        console.log("Left a guild: " + guild.name);
      } catch (err) {
        console.log(err);
      }
    } else {
      console.log("Left a guild (possible outage): " + guild.name);
    }
  },
};
