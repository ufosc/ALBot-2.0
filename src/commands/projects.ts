import { BaseCommandInteraction, MessageActionRow, MessageButton, MessageComponentInteraction, MessageEmbed} from "discord.js";
import { ICommand } from "../icommand";

export const projects: ICommand = {
    name: "projects",
    description: "Display Active Projects",
    options: [
    ],

    execute: async (interaction: BaseCommandInteraction) => {
        
        const row = new MessageActionRow()
            .addComponents(
                new MessageButton()
                    .setCustomId("back")
                    .setEmoji("⬅️")
                    .setStyle("SECONDARY")
            )
            .addComponents(
                new MessageButton()
                    .setCustomId("forward")
                    .setEmoji("➡️")
                    .setStyle("SECONDARY")
            )

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
            .addField("Roles:", "bot-dev", true)
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

        await interaction.reply({embeds: [projects[page]], components: [row]})

        const filter = (button: MessageComponentInteraction) => button.customId === 'back' || button.customId === 'forward';
        const collector = interaction.channel?.createMessageComponentCollector({filter})

        collector?.on('collect', async button => {
            if (button.customId === 'back') {
                if (page >= 1) {
                    page -= 1
                }
                await interaction.editReply({embeds: [projects[page]]})
                button.deferUpdate()
            }

            if (button.customId === 'forward') {
                if (page <= projects.length - 2) {
                    page += 1
                }
                await interaction.editReply({embeds: [projects[page]]})
                button.deferUpdate()
            }
        })


    }
}

export default projects