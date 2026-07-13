const Discord = require('discord.js');
const dutyConfig = require("../../database/models/dutyConfig");
const dutyStatus = require("../../database/models/dutyStatus");

module.exports = async (client) => {
    /**
     * Rebuilds and edits (or sends, if missing) the live duty panel message for a guild.
     * @param {String} guildId
     */
    client.renderDutyPanel = async function (guildId) {
        const config = await dutyConfig.findOne({ Guild: guildId });
        if (!config) return;

        const guild = client.guilds.cache.get(guildId);
        if (!guild) return;

        const channel = guild.channels.cache.get(config.Channel);
        if (!channel) return;

        const allStatuses = await dutyStatus.find({ Guild: guildId });
        const inDuty = allStatuses.filter(s => s.Status === 'in');
        const offDuty = allStatuses.filter(s => s.Status === 'off');

        const formatList = (list) => {
            if (list.length === 0) return '*Nobody here*';
            return list
                .sort((a, b) => b.Since - a.Since)
                .map(s => `<@${s.User}> - <t:${Math.round(s.Since / 1000)}:R>`)
                .join('\n');
        };

        const embed = client.templateEmbed()
            .setTitle('📋・Staff Duty')
            .addFields(
                { name: '🟢┆IN-Duty Staff', value: formatList(inDuty), inline: false },
                { name: '⚫┆OFF-Duty Staff', value: formatList(offDuty), inline: false },
            );

        if (config.Message) {
            try {
                const msg = await channel.messages.fetch(config.Message);
                await msg.edit({ embeds: [embed] });
                return;
            } catch (e) {
                // message was deleted, fall through and send a new one
            }
        }

        const newMsg = await channel.send({ embeds: [embed] });
        config.Message = newMsg.id;
        await config.save();
    };
};
