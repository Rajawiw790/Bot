const Discord = require('discord.js');

const Schema = require("../../database/models/stats");

module.exports = async (client, interaction, args) => {
    const members = await interaction.guild.members.fetch();

    var channelName = await client.getTemplate(interaction.guild);
    channelName = channelName.replace(`{emoji}`, "🤖")
    channelName = channelName.replace(`{name}`, `Bots: ${members.filter(member => member.user.bot).size || 0}`)

    await interaction.guild.channels.create({
        name: channelName,
        type:  Discord.ChannelType.GuildVoice, permissionOverwrites: [
            {
                deny: [Discord.PermissionsBitField.Flags.Connect],
                id: interaction.guild.id
            },
        ],
    }).then(async (channel) => {
        try {
            const data = await Schema.findOne({ Guild: interaction.guild.id });

            if (data) {
                data.Bots = channel.id;
                data.save();
            }
            else {
                new Schema({
                    Guild: interaction.guild.id,
                    Bots: channel.id
                }).save();
            }
                } catch (err) { console.error(err); }

        client.succNormal({
            text: `Bots count created!`,
            fields: [
                {
                    name: `📘┆Channel`,
                    value: `${channel}`
                }
            ],
            type: 'editreply'
        }, interaction);
    })

}

 