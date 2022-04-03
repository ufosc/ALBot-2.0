import { BaseCommandInteraction, MessageActionRow, MessageButton, MessageComponentInteraction, MessageEmbed} from "discord.js";
import { ICommand } from "../icommand";
import config from '../../config.json'
import projectData from "../projects.json"

export const projects: ICommand = {
    name: "projects",
    description: "Display Active Projects",
    options: [
    ],

    execute: async (interaction: BaseCommandInteraction) => {
        
        // User info 
        let guild: any = interaction.client.guilds.cache.get(config.guildId)
        const member = await guild.members.fetch(interaction.user.id)

        // Message Buttons 
        const backward = new MessageButton()
            .setCustomId("backward")
            .setEmoji("⬅️")
            .setStyle("SECONDARY")
        
        const forward = new MessageButton()
            .setCustomId("forward")
            .setEmoji("➡️")
            .setStyle("SECONDARY")

        const assignRole = new MessageButton()
            .setCustomId("assign-role")
            .setLabel("Assign Role")
            .setStyle("SUCCESS")
        
        const removeRole = new MessageButton()
            .setCustomId("remove-role")
            .setLabel("Remove Role")
            .setStyle("DANGER")
        
        // Message Row Component
        const assign = new MessageActionRow().addComponents([backward, forward, assignRole])
        const remove = new MessageActionRow().addComponents([backward, forward, removeRole])
        var row = assign

        var page = 0
        var keys = Object.keys(projectData)

        const getProject = (page: number) => {
            // Get project key based on page 
            return keys[page] as keyof typeof projectData
        }
        
        // Change button based on if user already has role
        const setRow = () => {
            let roleName = projectData[getProject(page)].fields[1].value
            if (member.roles.cache.some((role: any) => role.name === roleName)) {
                row = remove
            }
            else {
                row = assign
            }
        }

        setRow()

        await interaction.reply({embeds: [projectData[getProject(page)]], components: [row]})
        

        const filter = (button: MessageComponentInteraction) => button.customId === "backward" || button.customId === "forward" || button.customId === "assign-role" || button.customId === "remove-role";
        const collector = interaction.channel?.createMessageComponentCollector({filter})

        collector?.on('collect', async button => {
            if (button.customId === "backward") {
                if (page >= 1) {
                    page -= 1
                }

                setRow()
                await interaction.editReply({embeds: [projectData[getProject(page)]], components: [row]})
                button.deferUpdate()
            }

            if (button.customId === "forward") {
                if (page <= keys.length - 2) {
                    page += 1
                }

                setRow()
                await interaction.editReply({embeds: [projectData[getProject(page)]], components: [row]})
                button.deferUpdate()
            }

            if (button.customId === "assign-role") {
                // Find Role and Add to member
                let roleName = projectData[getProject(page)].fields[1].value
                var role = interaction.guild?.roles.cache.find(role => role.name === roleName)
                member.roles.add(role)
                row = remove
                await interaction.editReply({embeds: [projectData[getProject(page)]], components: [row]})
                button.deferUpdate()

            }

            if (button.customId === "remove-role") {
                // Find role and remove from member
                let roleName = projectData[getProject(page)].fields[1].value
                var role = interaction.guild?.roles.cache.find(role => role.name === roleName)
                member.roles.remove(role)
                row = assign
                await interaction.editReply({embeds: [projectData[getProject(page)]], components: [row]})
                button.deferUpdate()
            }
        })


    }
}

export function getCommands(): ICommand[] {
    return [projects];
}
