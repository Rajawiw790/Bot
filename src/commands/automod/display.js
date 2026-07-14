const Discord = require('discord.js');

const Schema = require("../../database/models/blacklist");

module.exports = async (client, interaction, args) => {
    try {
        const data = await Schema.findOne({ Guild: interaction.guild.id });

        if (data && data.Words.length > 0) {
            client.embed({
                title: "🤬・Blacklisted words",
                desc: data.Words.join(", "),
                type: 'editreply'
            }, interaction)
        }
        else {
            client.errNormal({
                error: `This guild has not data!`,
                type: 'editreply'
            }, interaction);
        }
        } catch (err) { console.error(err); }
}

 