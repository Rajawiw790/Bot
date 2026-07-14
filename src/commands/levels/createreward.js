const Discord = require('discord.js');

const Schema = require("../../database/models/levelRewards");

module.exports = async (client, interaction, args) => {
    let level = interaction.options.getNumber('level');
    let role = interaction.options.getRole('role');

    const perms = await client.checkUserPerms({
        flags: [Discord.PermissionsBitField.Flags.ManageMessages],
        perms: [Discord.PermissionsBitField.Flags.ManageMessages]
    }, interaction)

    if (perms == false) return;

    try {
        const data = await Schema.findOne({ Guild: interaction.guild.id, Level: level });

        if (data) {
            return client.errNormal({ 
                error: "This level already has a reward!",
                type: 'editreply'
            }, interaction);
        }
        else {
            new Schema({
                Guild: interaction.guild.id,
                Level: level,
                Role: role.id
            }).save();

            client.succNormal({ 
                text: `Level reward created`,
                fields: [
                    {
                        name: "📘┆Role",
                        value: `${role}`,
                        inline: true,
                    }
                ],
                type: 'editreply'
            }, interaction);
        }
        } catch (err) { console.error(err); }
}

 