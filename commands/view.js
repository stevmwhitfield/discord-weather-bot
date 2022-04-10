const { SlashCommandBuilder } = require("@discordjs/builders");
const settings = require("../settings.json");

module.exports = {
  data: new SlashCommandBuilder()
    .setName("view")
    .setDescription("Displays information about a setting.")
    .addStringOption((option) =>
      option
        .setName("option")
        .setDescription("The setting you want to view.")
        .setRequired(true)
        .addChoice("location", settings.location)
    ),
  async execute(interaction) {
    await interaction.reply(interaction.options.getString("option"));
  },
};
