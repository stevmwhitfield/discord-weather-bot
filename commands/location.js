const { SlashCommandBuilder } = require("@discordjs/builders");
const location = "Lakeland, FL";

module.exports = {
  data: new SlashCommandBuilder()
    .setName("location")
    .setDescription("Replies with location."),
  async execute(interaction) {
    await interaction.reply(location);
  },
};
