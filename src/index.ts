// Require the necessary discord.js classes
import fs from "fs";
import path from "path";
import { Client, Intents, Collection } from "discord.js";
const { token } = require('../config.json');

// Create a new client instance
const client = new Client({ intents: [Intents.FLAGS.GUILDS] });

// Import events into client
const eventFiles = fs.readdirSync(path.join(__dirname, './events'))
					.filter((file: string) => file.endsWith('.ts'));
for (const file of eventFiles) {
	const event = require(`./events/${file}`).default;
	if (event.once) {
		client.once(event.name, (...args : any[]) => event.execute(...args));
	}
	else {
		client.on(event.name, (...args: any[]) => event.execute(...args));
	}
}

// Login to Discord with your client's token
client.login(token);
