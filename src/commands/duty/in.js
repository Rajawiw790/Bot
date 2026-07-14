const Schema = require("../../database/models/dutyStatus");

module.exports = async (client, interaction, args) => {
    const existing = await Schema.findOne({ Guild: interaction.guild.id, User: interaction.user.id });

    if (existing && existing.Status === 'in') {
        return client.errNormal({
            error: 'You are already on duty!',
            type: 'editreply'
        }, interaction);
    }

    await Schema.findOneAndUpdate(
        { Guild: interaction.guild.id, User: interaction.user.id },
        { Guild: interaction.guild.id, User: interaction.user.id, Status: 'in', Since: Date.now() },
        { upsert: true }
    );

    await client.renderDutyPanel(interaction.guild.id);

    return client.succNormal({
        text: '🟢 You are now **on duty**!',
        type: 'editreply'
    }, interaction);
};
