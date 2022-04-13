require("dotenv").config();
const fs = require("node:fs");
const { Client, Intents, Collection } = require("discord.js");
const mongoClient = require("./mongodb/dbConnect.js").client;

const token = process.env.DISCORD_TOKEN;

const client = new Client({ intents: [Intents.FLAGS.GUILDS] });

client.commands = new Collection();
const commandFiles = fs
  .readdirSync("./commands")
  .filter((file) => file.endsWith(".js"));

for (const file of commandFiles) {
  const command = require(`./commands/${file}`);
  client.commands.set(command.data.name, command);
}

const eventFiles = fs
  .readdirSync("./events")
  .filter((file) => file.endsWith(".js"));

for (const file of eventFiles) {
  const event = require(`./events/${file}`);
  if (event.once) {
    client.once(event.name, (...args) => event.execute(client, ...args));
  } else {
    client.on(event.name, (...args) => event.execute(client, ...args));
  }
}

const createGuild = async (guild) => {
  try {
    const db = mongoClient.db("guild-settings");
    const settings = db.collection("settings");

    settings.insertOne({
      guildId: guild.id,
      guildName: guild.name,
      location: "Lakeland, Florida",
      lat: 28.0394654,
      lon: -81.9498042,
    });

    console.log("Joined a new guild: " + guild.name);
  } catch (err) {
    console.log(err);
  }
};

const deleteGuild = async (guild) => {
  if (guild.available) {
    try {
      const db = mongoClient.db("guild-settings");
      const settings = db.collection("settings");

      settings.deleteOne({ guildId: guild.id });

      console.log("Left a guild: " + guild.name);
    } catch (err) {
      console.log(err);
    }
  } else {
    console.log("Left a guild (possible outage): " + guild.name);
  }
};

client.on("guildCreate", (guild) => {
  createGuild(guild);
});

client.on("guildDelete", (guild) => {
  deleteGuild(guild);
});

client.login(token);
