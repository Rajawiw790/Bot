const Discord = require('discord.js');

const Schema = require("../../database/models/birthday");

module.exports = async (client, interaction, args) => {
    try {
        const data = await Schema.findOne({ Guild: interaction.guild.id, User: interaction.user.id });

        if (!data) return client.errNormal({ 
            error: "No birthday found!",
            type: 'editreply' 
        }, interaction);

        Schema.findOneAndDelete({ Guild: interaction.guild.id, User: interaction.user.id }).then(() => {
            client.succNormal({ 
                text: "Deleted your birthday", 
                type: 'editreply' 
            }, interaction)
        })
        } catch (err) { console.error(err); }
}

 