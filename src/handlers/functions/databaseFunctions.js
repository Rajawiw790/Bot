module.exports = (client) => {
    client.createChannelSetup = async function (Schema, channel, interaction) {
        try {
            const data = await Schema.findOne({ Guild: interaction.guild.id });

            if (data) {
                data.Channel = channel.id;
                data.save();
            }
            else {
                new Schema({
                    Guild: interaction.guild.id,
                    Channel: channel.id
                }).save();
            }
                } catch (err) { console.error(err); }

        client.succNormal({
            text: `Channel has been set up successfully!`,
            fields: [
                {
                    name: `📘┆Channel`,
                    value: `${channel} (${channel.id})`
                }
            ],
            type: 'editreply'
        }, interaction);
    }

    client.createRoleSetup = async function (Schema, role, interaction) {
        try {
            const data = await Schema.findOne({ Guild: interaction.guild.id });

            if (data) {
                data.Role = role.id;
                data.save();
            }
            else {
                new Schema({
                    Guild: interaction.guild.id,
                    Role: role.id
                }).save();
            }
                } catch (err) { console.error(err); }

        client.succNormal({
            text: `Role has been set up successfully!`,
            fields: [
                {
                    name: `📘┆Role`,
                    value: `${role} (${role.id})`
                }
            ],
            type: 'editreply'
        }, interaction);
    }
}