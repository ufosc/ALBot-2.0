import { Base, BaseCommandInteraction, Constants, Interaction} from "discord.js";
import { ICommand } from "../icommand";
import config from '../../config.json'
import { dir } from "console";
let roles = new Set<string>();
roles.add("club")
roles.add("Officer")

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
        if(roles.has(name as string))
	{
            var guild: any = interaction.client.guilds.cache.get(config.guildId)
            const member = await guild.members.fetch(interaction.user.id)
            const role = await guild.roles.cache.find((r: any) => r.name === (name as string))
            member.roles.add(role)
            await interaction.reply(`Added to role successfully!`);

        }
        else 
        {
            await interaction.reply(`No such role`);

        }
    }
}
const OpenRole: ICommand = {
    name: "openrole",
    description: "Creates a role",
    options: [
        {
            name: "role",
            description: "Role that admin wants to create",
            required: true,
            type: Constants.ApplicationCommandOptionTypes.STRING
        }
    ],
    execute: async (interaction: BaseCommandInteraction) => {
        let name1 = interaction.options.get("role")?.value;
        var guild: any = interaction.client.guilds.cache.get(config.guildId)
        const member = await guild.members.fetch(interaction.user.id)
        let tempStr: string = name1 as string
        if(member.roles.cache.some((role: any) => role.name === 'Officer'))
	    {            
            
           roles.add((name1 as string))
           const newRole = await guild.roles.create({
                data: {
                  name: (name1 as string),
                  color: 'BLUE',
                },
                reason: 'For fun',
              })
              .then(() => console.log("here"))
              .catch(console.error)

            await interaction.reply(`role created successfully!`);

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
            description: "Role that admin wants to close",
            required: true,
            type: Constants.ApplicationCommandOptionTypes.STRING
        }
    ],
    execute: async (interaction: BaseCommandInteraction) => {
        let name = interaction.options.get("role")?.value;
        var guild: any = interaction.client.guilds.cache.get(config.guildId)
        const member = await guild.members.fetch(interaction.user.id)

        if(member.roles.cache.some('Officer'))
	    {             
 
            if(roles.has(name as string))
             {   
                const role1: any = await guild.roles.cache.find((r: any) => r.name === (name as string))
                role1.members.forEach((member: any, i: any) => { // Looping through the members of Role.
                    setTimeout(() => {
                        member.roles.remove(role1); // Removing the Role.
                    }, i * 1000);
                });
               
                roles.delete((name as string))
                await interaction.reply(`no such role!`)
             }
             else
                await interaction.reply(`role removed successfully!`);


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
               role
            ));
            messageLines.push("```")
            await interaction.reply(messageLines.join("\n"));
            return;
        
    }

}
export function getCommands(): ICommand[] {
    return [GiveRole, OpenRole, CloseRole, ShowRoles];
}
