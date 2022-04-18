import { BaseCommandInteraction, Constants} from "discord.js";
import { ICommand } from "../icommand";

const helloWorld: ICommand = {
    name: "helloworld",
    description: "Hello World in different languages",
    options: [
        {
            name: "language",
            description: "Programming language",
            required: true,
            type: Constants.ApplicationCommandOptionTypes.STRING
        }
    ],

    execute: async (interaction: BaseCommandInteraction) => {
        await interaction.reply(interaction.options.get("language")?.value as string)
    }

}

export function getCommands(): ICommand[] {
    return [helloWorld];
}
