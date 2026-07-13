const Schema = require("../../database/models/dutyConfig");

module.exports = async (client, interaction, args) => {
    const channel = interaction.options.getChannel('channel');

    await Schema.findOneAndUpdate(
        { Guild: interaction.guild.id },
        { Guild: interaction.guild.id, Channel: channel.id, Message: null },
        { upsert: true }
    );

    await client.renderDutyPanel(interaction.guild.id);

    return client.succNormal({
        text: 'Duty panel configured!',
        fields: [
            { name: '📋┇Panel channel', value: `<#${channel.id}>`, inline: true },
        ],
        type: 'editreply'
    }, interaction);
};
