const Schema = require("../../database/models/dutyStatus");

module.exports = async (client, interaction, args) => {
    const existing = await Schema.findOne({ Guild: interaction.guild.id, User: interaction.user.id });

    if (!existing || existing.Status === 'off') {
        return client.errNormal({
            error: 'You are already off duty!',
            type: 'editreply'
        }, interaction);
    }

    await Schema.findOneAndUpdate(
        { Guild: interaction.guild.id, User: interaction.user.id },
        { Status: 'off', Since: Date.now() },
        { upsert: true }
    );

    await client.renderDutyPanel(interaction.guild.id);

    return client.succNormal({
        text: '⚫ You are now **off duty**!',
        type: 'editreply'
    }, interaction);
};
