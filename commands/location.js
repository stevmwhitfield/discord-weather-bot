require("dotenv").config();
const { SlashCommandBuilder } = require("@discordjs/builders");
const mongoClient = require("../mongodb/dbConnect.js").client;
const axios = require("axios");
const fs = require("node:fs");

const API_KEY = process.env.OPENWEATHER_API_KEY;

const putLocation = async (id, newLocation) => {
  try {
    await axios
      .get(
        `http://api.openweathermap.org/geo/1.0/direct?q=${newLocation}&limit=1&appid=${API_KEY}`
      )
      .then(async (res) => {
        try {
          if (res.data.length > 0) {
            const { name, lat, lon, state } = res.data[0];
            let tempName = name + ", " + state;
            //-----------------------------------------------------
            const db = mongoClient.db("guild-settings");
            const settings = db.collection("settings");

            const query = { guildId: id };
            settings.updateOne(query, {
              $set: { location: tempName, lat, lon },
            });

            if ((await settings.countDocuments()) === 0) {
              console.log("No documents found!");
            }
            //-----------------------------------------------------
            output = "New location set: " + tempName;
          } else {
            output = "Invalid location. Please enter the name of a city.";
          }
        } catch (error) {
          console.log(error);
        }
      })
      .catch((err) => console.log(err));
    //--------------------------------
  } catch (err) {
    console.log(err);
  }
};

let tempLocation;
let output = "";

module.exports = {
  data: new SlashCommandBuilder()
    .setName("location")
    .setDescription("Sets the location.")
    .addStringOption((option) =>
      option.setName("city").setDescription("City").setRequired(true)
    ),
  async execute(interaction) {
    tempLocation = interaction.options.getString("city");
    await putLocation(interaction.guildId, tempLocation);
    await interaction.reply(output, { ephemeral: true });
  },
};
