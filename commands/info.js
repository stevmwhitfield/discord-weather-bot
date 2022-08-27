require("dotenv").config();
const { SlashCommandBuilder } = require("@discordjs/builders");
const { MessageEmbed } = require("discord.js");

module.exports = {
  data: new SlashCommandBuilder()
    .setName("info")
    .setDescription("Displays information about the bot."),
  async execute(interaction) {
    const infoEmbed = new MessageEmbed()
      .setColor("#5c3fb3")
      .setTitle("About Weather")
      .setDescription(
        "'Weather' is a simple bot made to report the weather in 4-hour increments from the current hour." +
          "\n\n" +
          "Weather data is fetched in real-time from https://openweathermap.org/api."
      )
      .setFooter({ text: "Created by Steven Whitfield." })
      .setFields(
        {
          name: "Commands",
          value: "All available commands and what they do.",
        },
        { name: "/info", value: "Displays information about the bot." },
        {
          name: "/view <setting>",
          value: "Displays the selected server settings.",
        },
        {
          name: "/location <city>",
          value: "Sets the current location to the specified city.",
        },
        {
          name: "/weather",
          value:
            "Displays weather data for the next four hours, starting from the current hour.",
        }
      );
    await interaction.reply({ embeds: [infoEmbed], ephemeral: true });
  },
};
