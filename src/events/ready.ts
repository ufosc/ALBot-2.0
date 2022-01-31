import { Client } from "discord.js";
import { IEvent } from "../ievent";

export default <IEvent> {
	name: 'ready',
	once: true,
	execute(client : Client): void {
		if (!client.user) {
			console.log("ERROR: Client user not found\nReady!");
		}
		else {
			console.log(`Ready! Logged in as ${client.user.tag}`);
		}
	},
};
