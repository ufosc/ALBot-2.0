import { BaseCommandInteraction, Constants} from "discord.js";
import { ICommand } from "../icommand";
import helloWorldData from "../hello_worlds.json"

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
        const language = interaction.options.get("language")?.value as string
        const key = language as keyof typeof helloWorldData
        
        if (helloWorldData[key] === undefined) {
            await interaction.reply("Language not available")
            return
        }

        await interaction.reply("```"+language+"\n"+helloWorldData[key]+"\n```")
    }

}

export function getCommands(): ICommand[] {
    return [helloWorld];
}
