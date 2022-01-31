import { BaseCommandInteraction } from "discord.js";
import { ICommand } from "../icommand";

export const Orange: ICommand = {
    name: "orange",
    description: "Replies with a classic Gator chant!",
    execute: async (interaction: BaseCommandInteraction) => {
        await interaction.reply('Blue!');
    }
}

export default Orange;