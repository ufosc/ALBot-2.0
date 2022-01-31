import { BaseCommandInteraction } from "discord.js";
import { ICommand } from "../icommand";

export const Server: ICommand = {
    name: "server",
    description: "Replies with server info",
    execute: async (interaction: BaseCommandInteraction) => {
        if (!interaction.guild) {
            await interaction.reply("Guild information not found!")
        }
        else {
            await interaction.reply(`Server name: ${interaction.guild.name}\nTotal members: ${interaction.guild.memberCount}`);
        }
    }
}

export default Server;