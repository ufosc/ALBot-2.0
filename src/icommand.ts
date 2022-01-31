import { Interaction, ChatInputApplicationCommandData } from "discord.js"

export interface ICommand extends ChatInputApplicationCommandData {
    execute(interaction: Interaction): Promise<void>;
}