require("dotenv").config();
const { SlashCommandBuilder } = require("@discordjs/builders");
const mongoClient = require("../mongodb/dbConnect.js").client;

let info;
const getInfo = async (id) => {
  try {
    const db = mongoClient.db("guild-settings");
    const settings = db.collection("settings");

    const query = { guildId: id };
    settings.findOne(query, (err, data) => {
      if (err) throw err;
      info = data;
    });

    if ((await settings.countDocuments()) === 0) {
      console.log("No documents found!");
    }
  } catch (err) {
    console.log(err);
  }
};

module.exports = {
  data: new SlashCommandBuilder()
    .setName("info")
    .setDescription("Displays information."),
  async execute(interaction) {
    await getInfo(interaction.guildId);
    if (info)
      await interaction.reply(
        "Location: " +
          info.location +
          "\nLat: " +
          info.lat +
          "\nLon: " +
          info.lon
      );
    else await interaction.reply("Failed to get info.");
  },
};
