const Schema = require('../../database/models/profile');

module.exports = async (client, interaction, args) => {
    try {
        const data = await Schema.findOne({ User: interaction.user.id });

        if (data) {
            return client.errNormal({ error: "You already have a Bot profile", type: "editreply" }, interaction);
        }
        else {
            new Schema({
                User: interaction.user.id
            }).save();

            client.succNormal({ text: "Profile created! View your profile by running \`profile\`", type: "editreply" }, interaction);
        }
        } catch (err) { console.error(err); }
}

 