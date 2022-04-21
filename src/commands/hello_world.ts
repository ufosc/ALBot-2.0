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

const helloWorldLanguages: ICommand = {
    name: "helloworld_list",
    description: "List of Hello World Languages",
    
    execute: async (interaction: BaseCommandInteraction) => {
        const keys = Object.keys(helloWorldData)
        const languages = keys.join("\n")
        await interaction.reply("```\n"+languages+"\n```")
    }
}

export function getCommands(): ICommand[] {
    return [helloWorld, helloWorldLanguages];
}
