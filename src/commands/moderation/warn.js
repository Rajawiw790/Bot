const Discord = require('discord.js');

const Schema = require("../../database/models/warnings");
const Case = require("../../database/models/warnCase");
module.exports = async (client, interaction, args) => {
    const perms = await client.checkUserPerms({
        flags: [Discord.PermissionsBitField.Flags.ManageMessages],
        perms: [Discord.PermissionsBitField.Flags.ManageMessages]
    }, interaction);

    if (perms == false) {
        client.errNormal({
            error: "You don't have the required permissions to use this command!",
            type: 'editreply'
        }, interaction);
        return;
    }

    var member = interaction.options.getUser('user');
    var reason = interaction.options.getString('reason');
    var caseNumber;
    await Case.findOne({ Guild: interaction.guild.id }).then(async data => {
        if (!data) {
            new Case({
                Guild: interaction.guild.id,
                Case: 1
            }).save();
            caseNumber = 1;
        }
        else {
            data.Case += 1;
            data.save();
            caseNumber = data.Case;
        }
    });

    try {
        const data = await Schema.findOne({ Guild: interaction.guild.id, User: member.id });

        if (data) {
            data.Warnings.push({
                Moderator: interaction.user.id,
                Reason: reason,
                Date: Date.now(),
                Case: caseNumber
            });
            data.save();
        }
        else {
            new Schema({
                Guild: interaction.guild.id,
                User: member.id,
                Warnings: [{
                    Moderator: interaction.user.id,
                    Reason: reason,
                    Date: Date.now(),
                    Case: caseNumber
                }]
            }).save();
        }
        } catch (err) { console.error(err); }

    client.embed({
        title: `🔨・Warn`,
        desc: `You've been warned in **${interaction.guild.name}**`,
        fields: [
            {
                name: "👤┆Moderator",
                value: interaction.user.tag,
                inline: true
            },
            {
                name: "📄┆Reason",
                value: reason,
                inline: true
            }
        ]
    }, member).catch(() => { })

    client.emit('warnAdd', member, interaction.user, reason)
    client.succNormal({
        text: `User has received a warning!`,
        fields: [
            {
                name: "👤┆User",
                value: `${member}`,
                inline: true
            },
            {
                name: "👤┆Moderator",
                value: `${interaction.user}`,
                inline: true
            },
            {
                name: "📄┆Reason",
                value: reason,
                inline: false
            }
        ],
        type: 'editreply'
    }, interaction);
}

 