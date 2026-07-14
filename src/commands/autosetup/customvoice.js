const Discord = require('discord.js');

const voiceSchema = require("../../database/models/voice");

module.exports = async (client, interaction, args) => {
    interaction.guild.channels.create({
        name: "Custom voice",
        type: Discord.ChannelType.GuildCategory,
    }).then((cat) => {
        interaction.guild.channels.create({
            name: "➕ Create Voice",
            type:  Discord.ChannelType.GuildVoice,
            parent: cat.id,
            permissionOverwrites: [
                {
                    deny: [Discord.PermissionsBitField.Flags.Speak],
                    id: interaction.guild.id
                },
            ],
        }).then(async (ch) => {
            try {
                const data = await voiceSchema.findOne({ Guild: interaction.guild.id });

                if (data) {
                    data.Category = cat.id;
                    data.Channel = ch.id
                    data.ChannelName = "{emoji} {channel name}"
                    data.save();
                }
                else {
                    new voiceSchema({
                        Guild: interaction.guild.id,
                        Channel: ch.id,
                        ChannelName: "{emoji} {channel name}",
                        Category: cat.id
                    }).save();
                }
                        } catch (err) { console.error(err); }

            client.succNormal({
                text: `Custom voice has been set up successfully!`,
                fields: [
                    {
                        name: `📘┆Channel`,
                        value: `${ch} (${ch.name})`
                    }
                ],
                type: 'editreply'
            }, interaction);
        })
    })
}

