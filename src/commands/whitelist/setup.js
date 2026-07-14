const Schema = require("../../database/models/whitelistConfig");

module.exports = async (client, interaction, args) => {
    const channel = interaction.options.getChannel('review_channel');
    const role = interaction.options.getRole('role');

    await Schema.findOneAndUpdate(
        { Guild: interaction.guild.id },
        { Guild: interaction.guild.id, ReviewChannel: channel.id, Role: role.id },
        { upsert: true }
    );

    return client.succNormal({
        text: 'Whitelist system configured!',
        fields: [
            { name: '📥┇Review channel', value: `<#${channel.id}>`, inline: true },
            { name: '🏷┇Accepted role', value: `<@&${role.id}>`, inline: true },
        ],
        type: 'editreply'
    }, interaction);
};
