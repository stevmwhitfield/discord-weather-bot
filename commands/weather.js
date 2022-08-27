require("dotenv").config();
const axios = require("axios");
const { SlashCommandBuilder } = require("@discordjs/builders");
const { MessageEmbed } = require("discord.js");
const mongoClient = require("../mongodb/dbConnect.js").client;
const API_KEY = process.env.OPENWEATHER_API_KEY;

let lat, lon;
const getGeo = async (id) => {
  try {
    const db = mongoClient.db("guild-settings");
    const settings = db.collection("settings");

    const query = { guildId: id };
    settings.findOne(query, (err, data) => {
      if (err) throw err;
      lat = data.lat;
      lon = data.lon;
    });

    if ((await settings.countDocuments()) === 0) {
      console.log("No documents found!");
    }
  } catch (err) {
    console.log(err);
  }
};

let weatherData;
let output = "";
let weatherEmbeds = [];
const getWeatherData = async () => {
  await axios
    .get(
      `https://api.openweathermap.org/data/2.5/onecall?lat=${lat}&exclude=minutely,daily&lon=${lon}&appid=${API_KEY}&units=imperial`
    )
    .then((res) => {
      weatherData = res.data;

      for (let i = 0; i < 4; i++) {
        let { dt, temp, feels_like, humidity, uvi, wind_speed, weather, pop } =
          weatherData.hourly[i];

        let hourlyDate = new Date(dt * 1000);
        let hourlyTime = hourlyDate.getHours();
        if (hourlyDate.getHours() > 11) {
          if (hourlyDate.getHours() > 12) {
            hourlyTime = hourlyDate.getHours() - 12 + " PM";
          } else hourlyTime += " PM";
        } else {
          hourlyTime += " AM";
        }

        let weatherEmbed = new MessageEmbed()
          .setColor("#5c3fb3")
          .setTitle(String(hourlyTime))
          .setDescription(weather[0].main)
          .setFooter({ text: `${"\u2800".repeat(50)}` })
          .addFields(
            { name: "Temperature", value: temp + " °F", inline: true },
            { name: "Feels Like", value: feels_like + " °F", inline: true },
            { name: "\u200b", value: "\u200b" },
            { name: "Wind Speed", value: wind_speed + " mph", inline: true },
            {
              name: "Wind Gusts",
              value: weatherData.hourly[i].wind_gust
                ? weatherData.hourly[i].wind_gust + " mph"
                : "N/A",
              inline: true,
            },
            { name: "\u200b", value: "\u200b" },
            {
              name: "Chance of Rain",
              value: Math.round(pop * 100) + "%",
              inline: true,
            },
            { name: "Humidity", value: humidity + "%", inline: true },
            { name: "UV Index", value: String(uvi), inline: true }
          );
        weatherEmbeds.push(weatherEmbed);
      }
    })
    .catch((error) => {
      console.error(error);
    })
    .finally(() => console.log("GET request complete."));
};

module.exports = {
  data: new SlashCommandBuilder()
    .setName("weather")
    .setDescription("Replies with weather data."),
  async execute(interaction) {
    await getGeo(interaction.guildId);
    if (lat && lon) {
      weatherEmbeds = [];
      await getWeatherData();
      await interaction.reply({ embeds: [...weatherEmbeds], ephemeral: true });
    } else {
      await interaction.reply("Failed to get weather data. Please try again", {
        ephemeral: true,
      });
    }
  },
};
