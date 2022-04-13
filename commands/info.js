require("dotenv").config();
const { SlashCommandBuilder } = require("@discordjs/builders");
const { MessageEmbed } = require("discord.js");
const mongoClient = require("../mongodb/dbConnect.js").client;

let infoEmbed;
const getInfo = async (id) => {
  try {
    const db = mongoClient.db("guild-settings");
    const settings = db.collection("settings");

    const query = { guildId: id };
    settings.findOne(query, (err, data) => {
      if (err) throw err;
      infoEmbed = new MessageEmbed()
        .setColor("#5c3fb3")
        .setTitle(data.location)
        .addFields(
          { name: "Latitude", value: String(data.lat), inline: true },
          { name: "Longitude", value: String(data.lon), inline: true }
        );
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
    if (infoEmbed) {
      await interaction.reply({ embeds: [infoEmbed] });
    } else await interaction.reply("Failed to get info.");
  },
};
