import fs from "fs";
import path from "path";
import { ICommand } from "./icommand";

const commandDir = "commands";

// indexed signature - maps command name -> command object
const commands: { [commandName: string]: ICommand } = {};

const commandFiles = fs.readdirSync(path.join(__dirname, commandDir))
                        .filter((file : string) => file.endsWith('.ts'));
for (const file of commandFiles) {
	const availableCommands: ICommand[] = require(`./commands/${file}`).getCommands();
	for (const command of availableCommands) {
		commands[command.name] = command;
	}
}

export default commands;
