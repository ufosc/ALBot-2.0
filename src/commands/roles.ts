import { Base, BaseCommandInteraction, Constants, Interaction} from "discord.js";
import { ICommand } from "../icommand";
import config from '../../config.json'
import { dir } from "console";
let roles = new Set<string>();

export let permitted = new Set<string>();

let refreshRoles = async function (interaction: BaseCommandInteraction): Promise<any> {
    let guild: any = interaction.client.guilds.cache.get(config.guildId)
    roles.clear()
    const role = await guild.roles.cache.forEach((r: any) => roles.add(r.name))
     roles.forEach((role: string) => {
        if (role.startsWith('@')) {
          roles.delete(role);
        }
      })

      if(interaction.client.user != null)
      { 
           roles.delete(interaction.client.user.username)
      }

}
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
        await refreshRoles(interaction)
        let name = interaction.options.get("role")?.value;
        let guild: any = interaction.client.guilds.cache.get(config.guildId)
        const member = await guild.members.fetch(interaction.user.id)

        if((roles.has(name as string) && permitted.has(name as string)) || (member.permissions.has('ADMINISTRATOR') && roles.has(name as string)) )
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
        await refreshRoles(interaction)

        let name = interaction.options.get("role")?.value;
        let guild: any = interaction.client.guilds.cache.get(config.guildId)
        const member = await guild.members.fetch(interaction.user.id)
        if((member.permissions.has('ADMINISTRATOR') && roles.has(name as string)))
	    {            
            const role = await guild.roles.cache.find((r: any) => r.name === (name as string))

            if(!role.permissions.has('ADMINISTRATOR'))
           {
                permitted.add((name as string))
                await interaction.reply(`role permissions saved successfully!`);
           }
           else
           {
            await interaction.reply(`Officer channel access blocked`);

           }

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
        await refreshRoles(interaction)

        let name = interaction.options.get("role")?.value;
        let guild: any = interaction.client.guilds.cache.get(config.guildId)
        const member = await guild.members.fetch(interaction.user.id)

        if((member.permissions.has('ADMINISTRATOR') && roles.has(name as string)))
	    {             
 
            if(permitted.has(name as string))
             {   
                permitted.delete((name as string))
                await interaction.reply(`role permissions removed successfully!`)
             }
             else
                await interaction.reply(`either role does not exist or is already open!`);


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
            await refreshRoles(interaction)

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
