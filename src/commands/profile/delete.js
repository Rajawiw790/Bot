const Schema = require('../../database/models/profile');

module.exports = async (client, interaction, args) => {

    try {
        const data = await Schema.findOne({ User: interaction.user.id });


        if (data) {
            Schema.findOneAndDelete({ Guild: interaction.guild.id, User: interaction.user.id }).then(() => {
                client.succNormal({
                    text: "Your profile was deleted!",
                    type: 'editreply'
                }, interaction);
            })
        }
        else {
            client.errNormal({
                error: 'No profile found!',
                type: 'editreply'
            }, interaction)
        }
        } catch (err) { console.error(err); }
}

 