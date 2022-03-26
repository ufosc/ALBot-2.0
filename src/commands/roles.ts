import { Base, BaseCommandInteraction, Constants, Interaction} from "discord.js";
import { ICommand } from "../icommand";
import config from '../../config.json'
import { dir } from "console";
let roles = new Set<string>();
roles.add("club")
roles.add("Officer")
roles.add("blabla")

let permitted = new Set<string>();

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
        var guild: any = interaction.client.guilds.cache.get(config.guildId)
        const member = await guild.members.fetch(interaction.user.id)

        if((roles.has(name as string) && permitted.has(name as string)) ||(member.roles.cache.some((role: any) => role.name === 'Officer')) )
	    {
            const role = await guild.roles.cache.find((r: any) => r.name === (name as string))
            member.roles.add(role)
            await interaction.reply(`Added to role successfully!`);

        }
        else
        {
            await interaction.reply(`No such role or not permitted`);

        }
    }
}
const OpenRole: ICommand = {
    name: "openrole",
    description: "Creates a role",
    options: [
        {
            name: "role",
            description: "Role that admin wants to give permissions for",
            required: true,
            type: Constants.ApplicationCommandOptionTypes.STRING
        }
    ],
    execute: async (interaction: BaseCommandInteraction) => {
        let name = interaction.options.get("role")?.value;
        var guild: any = interaction.client.guilds.cache.get(config.guildId)
        const member = await guild.members.fetch(interaction.user.id)
        if(member.roles.cache.some((role: any) => role.name === 'Officer'))
	    {            
            
           permitted.add((name as string))
       
           await interaction.reply(`role permissions saved successfully!`);

        }
        else 
        {
            await interaction.reply(`You are not an officer or something else went wrong`);

        }
    }
}
const CloseRole: ICommand = {
    name: "closerole",
    description: "Closes a role",
    options: [
        {
            name: "role",
            description: "Role that admin wants to close permissions for",
            required: true,
            type: Constants.ApplicationCommandOptionTypes.STRING
        }
    ],
    execute: async (interaction: BaseCommandInteraction) => {
        let name = interaction.options.get("role")?.value;
        var guild: any = interaction.client.guilds.cache.get(config.guildId)
        const member = await guild.members.fetch(interaction.user.id)

        if(member.roles.cache.some((role: any) => role.name === 'Officer'))
	    {             
 
            if(permitted.has(name as string))
             {   
                permitted.delete((name as string))
                await interaction.reply(`role permissions removed successfully!`)
             }
             else
                await interaction.reply(`no such role!`);


        }
        else 
        {
            await interaction.reply(`You are not an officer or something else went wrong`);

        }
    }
}
const ShowRoles: ICommand = {
    name: "roles",
    description: "See roles",
    
    execute: async (interaction: BaseCommandInteraction) => {
   
            let divider: string = "----------------"
            let messageLines: string[] = ["```", "Roles", divider];
            roles.forEach(role => messageLines.push(
               `${role}${permitted.has(role)? '*' : ''}`
            ));
            messageLines.push("*members can self-assign");

            messageLines.push("```")
            await interaction.reply(messageLines.join("\n"));
            return;
        
    }

}
export function getCommands(): ICommand[] {
    return [GiveRole, OpenRole, CloseRole, ShowRoles];
}
