import { BaseCommandInteraction, Interaction } from "discord.js";
import { IEvent } from "../ievent";
import commands from "../commands";

export default <IEvent> {
	name: 'interactionCreate',
	async execute(interaction: Interaction): Promise<void> {
        if (!interaction.isCommand()) return;

        const command = commands[interaction.commandName];

        if (!command) {
            // command not found
            return;
        }

        try {
            await command.execute(interaction);
        }
        catch (error) {
            console.error(error);
            await interaction.reply({
                content: 'There was an error while executing this command!',
                ephemeral: true,
            });
        }
    },
};
