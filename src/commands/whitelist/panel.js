const Discord = require('discord.js');
const Schema = require("../../database/models/whitelistConfig");

module.exports = async (client, interaction, args) => {
    const data = await Schema.findOne({ Guild: interaction.guild.id });
    if (!data) {
        return client.errNormal({
            error: 'Please run `/whitelist setup` first before posting the panel',
            type: 'editreply'
        }, interaction);
    }

    const title = interaction.options.getString('title') || `${client.config.serverName || interaction.guild.name} - Whitelist Application`;
    const description = interaction.options.getString('description') ||
        `**Whitelist Application Instructions**\n\n` +
        `Click the button below to apply. You will be asked for:\n` +
        `• Your RP name (Firstname Lastname)\n` +
        `• Your age\n` +
        `• A short backstory / bio\n\n` +
        `Applications are reviewed by staff. You'll be DMed once a decision is made.`;
    const image = interaction.options.getString('image');

    const embed = client.templateEmbed()
        .setTitle(title)
        .setDescription(description);
    if (image) embed.setImage(image);

    const row = new Discord.ActionRowBuilder()
        .addComponents(
            new Discord.ButtonBuilder()
                .setCustomId('wl_apply')
                .setLabel('Apply For Whitelist')
                .setEmoji('✅')
                .setStyle(Discord.ButtonStyle.Success)
        );

    await interaction.channel.send({ embeds: [embed], components: [row] });

    return client.succNormal({
        text: 'Whitelist panel posted!',
        type: 'editreply'
    }, interaction);
};
