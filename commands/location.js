const { SlashCommandBuilder } = require("@discordjs/builders");
const axios = require("axios");
const fs = require("node:fs");

require("dotenv").config();
const API_KEY = process.env.OPENWEATHER_API_KEY;

const settings = require("../settings.json");
const newSettings = JSON.parse(JSON.stringify(settings));

let tempLocation;
let output = "";
const updateLocation = async () => {
  await axios
    .get(
      `http://api.openweathermap.org/geo/1.0/direct?q=${tempLocation}&limit=1&appid=${API_KEY}`
    )
    .then((res) => {
      try {
        const { name, lat, lon, state } = res.data[0];
        newSettings.location = name + ", " + state;
        newSettings.lat = lat;
        newSettings.lon = lon;
        output += "New location set: " + tempLocation;
      } catch (error) {
        console.log(error);
      }
    })
    .then(() => {
      fs.writeFile("settings.json", JSON.stringify(newSettings), (err) => {
        if (err) throw err;
        console.log("Updated location: " + newSettings.location + ".");
      });
    })
    .catch((err) => console.log(err));
};

module.exports = {
  data: new SlashCommandBuilder()
    .setName("location")
    .setDescription("Sets the location.")
    .addStringOption((option) =>
      option.setName("city").setDescription("City").setRequired(true)
    ),
  async execute(interaction) {
    tempLocation = interaction.options.getString("city");
    updateLocation();
    await interaction.reply("Updating location... " + output);
  },
};
