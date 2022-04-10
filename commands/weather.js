require("dotenv").config();
const axios = require("axios");
const { SlashCommandBuilder } = require("@discordjs/builders");
const API_KEY = process.env.OPENWEATHER_API_KEY;
const { lat, lon } = require("../settings.json");

let weatherData;
let output = "";

const getWeatherData = async () => {
  await axios
    .get(
      `https://api.openweathermap.org/data/2.5/onecall?lat=${lat}&exclude=minutely,daily&lon=${lon}&appid=${API_KEY}&units=imperial`
    )
    .then((res) => {
      weatherData = res.data;

      output += "-- Hourly Weather --\n";
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
        output += "Time: " + hourlyTime + "\n";
        output += weather[0].main + "\n";
        output += "Temperature: " + temp + " °F\n";
        output += "Feels like: " + feels_like + " °F\n";
        output += "Humidity: " + humidity + "%\n";
        output += "UV Index: " + uvi + "\n";
        output += "Wind speed: " + wind_speed + " mph\n";
        if (weatherData.hourly[i].wind_gust)
          output += "Wind gusts: " + weatherData.hourly[i].wind_gust + " mph\n";
        output += "Chance of rain: " + pop + "%\n";
        output += "\n";
      }
    })
    .catch((error) => {
      output = "Oops. Something went wrong. Try again or come back later.";
      console.error(error);
    })
    .finally(() => console.log("GET request complete."));
};
getWeatherData();

module.exports = {
  data: new SlashCommandBuilder()
    .setName("weather")
    .setDescription("Replies with weather data."),
  async execute(interaction) {
    await interaction.reply(output);
  },
};
