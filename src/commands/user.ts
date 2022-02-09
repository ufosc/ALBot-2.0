import { BaseCommandInteraction } from "discord.js";
import { ICommand } from "../icommand";

export const User: ICommand = {
    name: "user",
    description: "Replies with user info",
    execute: async (interaction: BaseCommandInteraction) => {
		    await interaction.reply(`Your tag: ${interaction.user.tag}\nYour id: ${interaction.user.id}`);
    }
}

export function getCommands(): ICommand[] {
    return [User];
};
