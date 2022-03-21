import { Base, BaseCommandInteraction, Constants, Interaction} from "discord.js";
import { ICommand } from "../icommand";
import config from '../../config.json'
let directions = new Set<string>();
directions.add("club")

const GiveRole: ICommand = {
    name: "giverole",
    description: "Gives a user a role",
    options: [
        {
            name: "role",
            description: "Role that user wants",
            required: true,
            type: Constants.ApplicationCommandOptionTypes.STRING
        }
    ],
    execute: async (interaction: BaseCommandInteraction) => {
        let name = interaction.options.get("role")?.value;
        if(directions.has(name as string))
	{
            var guild: any = interaction.client.guilds.cache.get(config.guildId)
            const member = await guild.members.fetch(interaction.user.id)
            const role = await guild.roles.cache.find((r: any) => r.name === 'club')
            member.roles.add(role)
            await interaction.reply(`Added to role successfully!`);

        }
        else 
        {
            await interaction.reply(`No such role`);

        }
    }
}
export function getCommands(): ICommand[] {
    return [GiveRole];
}
