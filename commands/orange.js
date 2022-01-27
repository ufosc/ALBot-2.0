const { SlashCommandBuilder } = require('@discordjs/builders');

module.exports = {
    data: new SlashCommandBuilder()
          .setName('orange')
          .setDescription('Replies with a classic Gator chant!'),
    async execute(interaction) {
        await interaction.reply('Blue!');
    },
};