import { BaseCommandInteraction, MessageActionRow, MessageButton, MessageComponentInteraction, MessageEmbed} from "discord.js";
import { ICommand } from "../icommand";
import config from '../../config.json'

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

        // Embed and Embed Resources
        var Albot_resources = `
                        [Intro to TypeScript](https://youtu.be/gp5H0Vw39yw)
                        [Discord.js Documentation](https://discord.js.org/#/)
                        [Discrod.js Guide](https://discordjs.guide/#before-you-begin)
                        `

        var Albot = new MessageEmbed()
            .setTitle("ALBot-2.0")
            .setDescription(`Alpha version of ALBot 2.0, the spiritual successor to ALBot
                            <:octocat:830153162735747152> [Github Repo](https://github.com/ufosc/ALBot-2.0)
                            :star: 4`)
            .setColor("RED")
            .addField("Language:", "Typescript", true)
            .addField("Roles:", "Ninja", true)
            .addField("Resources:", Albot_resources, false)
        
        var Documiner = new MessageEmbed()
            .setTitle("DocuMiner")
            .setDescription(`A production-ready pipeline for text mining and subject indexing
                            <:octocat:830153162735747152> [Github Repo](https://github.com/ufosc/DocuMiner)
                            :star: 11`)
            .setColor("RED")
            .addField("Language:", "Python", true)
            .addField("Roles:", "Documiner", true)
            .addField("Resources", "None", false)
            
        var page = 0
        var projects = [Albot, Documiner]
        
        // Change button based on if user already has role
        let roleName = projects[page].fields[1].value
        if (member.roles.cache.some((role: any) => role.name === roleName)) {
            row = remove
        }
        else {
            row = assign
        }

        await interaction.reply({embeds: [projects[page]], components: [row]})

        const filter = (button: MessageComponentInteraction) => button.customId === "backward" || button.customId === "forward" || button.customId === "assign-role" || button.customId === "remove-role";
        const collector = interaction.channel?.createMessageComponentCollector({filter})

        collector?.on('collect', async button => {
            if (button.customId === "backward") {
                if (page >= 1) {
                    page -= 1
                }
                await interaction.editReply({embeds: [projects[page]]})
                button.deferUpdate()
            }

            if (button.customId === "forward") {
                if (page <= projects.length - 2) {
                    page += 1
                }

                await interaction.editReply({embeds: [projects[page]]})
                button.deferUpdate()
            }

            if (button.customId === "assign-role") {
                // Find Role and Add to member
                let roleName = projects[page].fields[1].value
                var role = interaction.guild?.roles.cache.find(role => role.name === roleName)
                member.roles.add(role)
                row = remove
                await interaction.editReply({embeds: [projects[page]], components: [row]})
                button.deferUpdate()

            }

            if (button.customId === "remove-role") {
                // Find role and remove from member
                let roleName = projects[page].fields[1].value
                var role = interaction.guild?.roles.cache.find(role => role.name === roleName)
                member.roles.remove(role)
                row = assign
                await interaction.editReply({embeds: [projects[page]], components: [row]})
                button.deferUpdate()
            }
        })


    }
}

export function getCommands(): ICommand[] {
    return [projects];
}
