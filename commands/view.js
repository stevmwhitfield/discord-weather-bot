const { SlashCommandBuilder } = require("@discordjs/builders");
const mongoClient = require("../mongodb/dbConnect.js").client;

let guildSettings;
const getSettings = async (id) => {
  try {
    const db = mongoClient.db("guild-settings");
    const settings = db.collection("settings");

    const query = { guildId: id };
    settings.findOne(query, (err, data) => {
      if (err) throw err;
      guildSettings = data;
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
    .setName("view")
    .setDescription("Displays information about a setting.")
    .addStringOption((option) =>
      option
        .setName("option")
        .setDescription("The setting you want to view.")
        .setRequired(true)
        .addChoice("location", "location")
        .addChoice("latitude", "lat")
        .addChoice("longitude", "lon")
    ),
  async execute(interaction) {
    await getSettings(interaction.guildId);

    if (guildSettings) {
      switch (interaction.options.getString("option")) {
        case "location":
          await interaction.reply("Location: " + guildSettings.location);
          break;
        case "lat":
          await interaction.reply("Latitude: " + guildSettings.lat);
          break;
        case "lon":
          await interaction.reply("Longitude: " + guildSettings.lon);
          break;
        default:
          console.warn("view.js: case not found.");
      }
    } else {
      await interaction.reply("Failed to get guild settings.");
    }
  },
};
