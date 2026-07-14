const Discord = require('discord.js');

const Schema = require("../../database/models/messageRewards");

module.exports = async (client, interaction, args) => {
    let messages = interaction.options.getNumber('amount');

    const perms = await client.checkUserPerms({
        flags: [Discord.PermissionsBitField.Flags.ManageMessages],
        perms: [Discord.PermissionsBitField.Flags.ManageMessages]
    }, interaction)

    if (perms == false) return;
    
    try {
        const data = await Schema.findOne({ Guild: interaction.guild.id, Messages: messages });

        if (data) {
            Schema.findOneAndDelete({ Guild: interaction.guild.id, Messages: messages }).then(() => {
                client.succNormal({
                    text: `Message reward removed`,
                    fields: [
                        {
                            name: "💬┆Messages",
                            value: `${messages}`,
                            inline: true,
                        }
                    ],
                    type: 'editreply'
                }, interaction);
            })
        }
        else {
            return client.errNormal({
                error: "No message reward found at this message amount!",
                type: 'editreply'
            }, interaction);
        }
        } catch (err) { console.error(err); }
}

 