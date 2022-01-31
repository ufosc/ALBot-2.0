const fs = require('fs');
const { REST } = require('@discordjs/rest');
import { Routes } from 'discord-api-types/v9';
const { clientId, guildId, token } = require('../config.json');
import commands from "./commands";
import { ICommand } from "./icommand";

const rest = new REST({ version: '9' }).setToken(token);

const commandList: ICommand[] = [];
for (const commandName in commands) {
	commandList.push(commands[commandName]);
}

rest.put(Routes.applicationGuildCommands(clientId, guildId), { body: commandList })
	.then(() => console.log('Successfully registered application commands.'))
	.catch(console.error);
