import { BaseCommandInteraction, MessageActionRow, MessageButton, MessageComponentInteraction, Constants} from "discord.js";
import { ICommand } from "../icommand";
import config from '../../config.json'
import projectData from "../projects.json"
import { permitted } from "./roles";

const projects: ICommand = {
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
        

        const filter = (button: MessageComponentInteraction) => (button.customId === "backward" || button.customId === "forward" || button.customId === "assign-role" || button.customId === "remove-role") && button.user.id === interaction.user.id;
        const collector = interaction.channel?.createMessageComponentCollector({filter, time: 60000})

        // Delete message after timeout
        collector?.on('end', async ()=> {
            await interaction.deleteReply()
        })


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
                
                // Exit if role not available
                if (role === undefined) {
                    await interaction.followUp("Role not Available")
                    button.deferUpdate()
                    return
                }

                if (role.name === "officer") {
                    await interaction.followUp("Only officers can have this role")
                    button.deferUpdate()
                    return
                }

                if (!permitted.has(role.name)) {
                    await interaction.followUp("This role is not open")
                    button.deferUpdate()
                    return
                }

                member.roles.add(role)
                row = remove
                await interaction.editReply({embeds: [projectData[getProject(page)]], components: [row]})
                button.deferUpdate()

            }

            if (button.customId === "remove-role") {
                // Find role and remove from member
                let roleName = projectData[getProject(page)].fields[1].value
                var role = interaction.guild?.roles.cache.find(role => role.name === roleName)
                
                // Exit if role not available
                if (role === undefined) {
                    await interaction.followUp("Role not Available")
                    button.deferUpdate()
                    return
                }

                if (role.name === "officer") {
                    await interaction.followUp("Only officers can have this role")
                    button.deferUpdate()
                    return
                }
                
                if (!permitted.has(role.name)) {
                    await interaction.followUp("This role is not open")
                    button.deferUpdate()
                    return
                }

                member.roles.remove(role)
                row = assign
                await interaction.editReply({embeds: [projectData[getProject(page)]], components: [row]})
                button.deferUpdate()
            }
        })


    }
}

const addResource: ICommand = {
    name: "add-resource",
    description: "Add resource to a project",
    options: [
        {
            name: "project-name",
            description: "Name of project",
            required: true,
            type: Constants.ApplicationCommandOptionTypes.STRING
        },
        {
            name: "resource-title",
            description: "Title of resource",
            required: true,
            type: Constants.ApplicationCommandOptionTypes.STRING
        },
        {
            name: "resource-url",
            description: "Url of resource",
            required: true,
            type: Constants.ApplicationCommandOptionTypes.STRING
        },

    ],

    execute: async (interaction: BaseCommandInteraction) => {
        const fs = require("fs")
        
        var keys = Object.keys(projectData)
        var projectName = interaction.options.get("project-name")?.value as string
        var resourceTitle = interaction.options.get("resource-title")?.value as string
        var resourceURL = interaction.options.get("resource-url")?.value as string
        
        // Check if valid project
        if (!keys.includes(projectName)) {
            interaction.reply("Not a valid Project!")
            return
        }

        var resources = projectData[projectName as keyof typeof projectData].fields[2].value

        // Adding new resource
        if (resources === "None") {
            // If this is the first resource, remove the None 
            projectData[projectName as keyof typeof projectData].fields[2].value = `[${resourceTitle}](${resourceURL})`
        }
        else {
            // Concat with previous resources
            projectData[projectName as keyof typeof projectData].fields[2].value = resources.concat(`\n[${resourceTitle}](${resourceURL})`)
        }

        fs.writeFile('src/projects.json', JSON.stringify(projectData, null, 4), (err:any) => {
            if (err) {
                interaction.reply("Resource could not be added")
            }
            else {
                interaction.reply("Resource successfully added!")
            }
        })
    }
}


export function getCommands(): ICommand[] {
    return [projects, addResource];
}
