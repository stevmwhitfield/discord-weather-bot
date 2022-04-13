const { SlashCommandBuilder } = require("@discordjs/builders");
const { MessageEmbed } = require("discord.js");
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
    .setDescription("Displays the value(s) of the server's settings.")
    .addStringOption((option) =>
      option
        .setName("option")
        .setDescription("The setting you want to view.")
        .setRequired(true)
        .addChoice("all", "all")
        .addChoice("location", "location")
        .addChoice("latitude", "lat")
        .addChoice("longitude", "lon")
    ),
  async execute(interaction) {
    await getSettings(interaction.guildId);

    if (guildSettings) {
      let viewEmbed;
      switch (interaction.options.getString("option")) {
        case "all":
          viewEmbed = new MessageEmbed()
            .setColor("#5c3fb3")
            .setTitle("Server Settings")
            .addFields(
              { name: "Location", value: guildSettings.location },
              {
                name: "Latitude",
                value: String(guildSettings.lat),
                inline: true,
              },
              {
                name: "Longitude",
                value: String(guildSettings.lon),
                inline: true,
              }
            );
          break;
        case "location":
          viewEmbed = new MessageEmbed()
            .setColor("#5c3fb3")
            .setTitle("Server Settings")
            .addFields({ name: "Location", value: guildSettings.location });
          break;
        case "lat":
          viewEmbed = new MessageEmbed()
            .setColor("#5c3fb3")
            .setTitle("Server Settings")
            .addFields({ name: "Latitude", value: String(guildSettings.lat) });
          break;
        case "lon":
          viewEmbed = new MessageEmbed()
            .setColor("#5c3fb3")
            .setTitle("Server Settings")
            .addFields({ name: "Longitude", value: String(guildSettings.lon) });
          break;
        default:
          console.warn("view.js: case not found.");
      }
      await interaction.reply({ embeds: [viewEmbed] });
    } else {
      await interaction.reply("Failed to get guild settings.");
    }
  },
};
