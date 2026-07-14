const { CommandInteraction, Client, SlashCommandBuilder, PermissionFlagsBits, ChannelType } = require('discord.js');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('whitelist')
        .setDescription('Manage the whitelist application system')
        .setDefaultMemberPermissions(PermissionFlagsBits.ManageGuild)
        .addSubcommand(subcommand =>
            subcommand
                .setName('setup')
                .setDescription('Configure the whitelist application system')
                .addChannelOption(option =>
                    option.setName('review_channel')
                        .setDescription('Channel where staff will accept/deny applications')
                        .addChannelTypes(ChannelType.GuildText)
                        .setRequired(true))
                .addRoleOption(option =>
                    option.setName('role')
                        .setDescription('Role given to accepted applicants')
                        .setRequired(true))
        )
        .addSubcommand(subcommand =>
            subcommand
                .setName('panel')
                .setDescription('Post the whitelist application panel in this channel')
                .addStringOption(option =>
                    option.setName('title')
                        .setDescription('Panel title')
                        .setRequired(false))
                .addStringOption(option =>
                    option.setName('description')
                        .setDescription('Panel description / rules text')
                        .setRequired(false))
                .addStringOption(option =>
                    option.setName('image')
                        .setDescription('Banner image URL')
                        .setRequired(false))
        ),

    /**
     * @param {Client} client
     * @param {CommandInteraction} interaction
     * @param {String[]} args
     */
    run: async (client, interaction, args) => {
        if (!interaction.memberPermissions.has(PermissionFlagsBits.ManageGuild)) {
            return client.errNormal({
                error: 'You need the "Manage Server" permission to use this command',
                type: 'ephemeral'
            }, interaction);
        }

        await interaction.deferReply({ fetchReply: true });
        client.loadSubcommands(client, interaction, args);
    },
};
