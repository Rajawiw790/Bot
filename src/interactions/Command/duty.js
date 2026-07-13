const { CommandInteraction, Client, SlashCommandBuilder, PermissionFlagsBits, ChannelType } = require('discord.js');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('duty')
        .setDescription('Staff clock-in / clock-out system')
        .addSubcommand(subcommand =>
            subcommand
                .setName('setup')
                .setDescription('Set the channel where the duty panel is shown (Admin only)')
                .addChannelOption(option =>
                    option.setName('channel')
                        .setDescription('Channel for the duty panel')
                        .addChannelTypes(ChannelType.GuildText)
                        .setRequired(true))
        )
        .addSubcommand(subcommand =>
            subcommand
                .setName('in')
                .setDescription('Clock in - go on duty')
        )
        .addSubcommand(subcommand =>
            subcommand
                .setName('out')
                .setDescription('Clock out - go off duty')
        ),

    /**
     * @param {Client} client
     * @param {CommandInteraction} interaction
     * @param {String[]} args
     */
    run: async (client, interaction, args) => {
        if (interaction.options.getSubcommand() === 'setup' && !interaction.memberPermissions.has(PermissionFlagsBits.ManageGuild)) {
            return client.errNormal({
                error: 'You need the "Manage Server" permission to use this command',
                type: 'ephemeral'
            }, interaction);
        }

        await interaction.deferReply({ fetchReply: true, ephemeral: interaction.options.getSubcommand() !== 'setup' });
        client.loadSubcommands(client, interaction, args);
    },
};
