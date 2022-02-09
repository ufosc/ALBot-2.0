import { BaseCommandInteraction } from "discord.js";
import { ICommand } from "../icommand";

export const Ping: ICommand = {
    name: "ping",
    description: "Replies with pong!",
    execute: async (interaction: BaseCommandInteraction) => {
        await interaction.reply('Pong!');
    }
}

export function getCommands(): ICommand[] {
    return [Ping];
};
