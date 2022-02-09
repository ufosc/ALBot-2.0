import { BaseCommandInteraction, Constants } from "discord.js";
import { ICommand } from "../icommand";

export const startPoll: ICommand = {
    name: "startpoll",
    description: "Opens a poll",
    options: [
        {
            name: "pollname",
            description: "The name of the poll",
            required: true,
            type: Constants.ApplicationCommandOptionTypes.STRING
        }
    ],
    execute: async (interaction: BaseCommandInteraction) => {
        await interaction.reply('NOT IMPELEMTED: Tried to create poll with name ');
    }
}

export function getCommands(): ICommand[] {
    return [startPoll];
}
