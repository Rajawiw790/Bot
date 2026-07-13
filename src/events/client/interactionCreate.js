const Discord = require('discord.js');
const Captcha = require("@haileybot/captcha-generator");

const reactionSchema = require("../../database/models/reactionRoles");
const banSchema = require("../../database/models/userBans");
const verify = require("../../database/models/verify");
const Commands = require("../../database/models/customCommand");
const CommandsSchema = require("../../database/models/customCommandAdvanced");
module.exports = async (client, interaction) => {
    // Commands
    if (interaction.isCommand() || interaction.isUserContextMenuCommand()) {
        banSchema.findOne({ User: interaction.user.id }, async (err, data) => {
            if (data) {
                return client.errNormal({
                    error: "You have been banned by the developers of this bot",
                    type: 'ephemeral'
                }, interaction);
            }
            else {
                const cmd = client.commands.get(interaction.commandName);
                if (!cmd) {
                    const cmdd = await Commands.findOne({
                        Guild: interaction.guild.id,
                        Name: interaction.commandName,
                    });
                    if (cmdd) {
                        return interaction.channel.send({ content: cmdd.Responce });
                    }

                    const cmdx = await CommandsSchema.findOne({
                        Guild: interaction.guild.id,
                        Name: interaction.commandName,
                    });
                    if (cmdx) {
                        // Remove interaction
                        if (cmdx.Action == "Normal") {
                            return interaction.reply({ content: cmdx.Responce });
                        } else if (cmdx.Action == "Embed") {
                            return client.simpleEmbed(
                                {
                                    desc: `${cmdx.Responce}`,
                                    type: 'reply'
                                },
                                interaction,
                            );
                        } else if (cmdx.Action == "DM") {
                            await interaction.deferReply({ ephemeral: true });
                            interaction.editReply({ content: "I have sent you something in your DMs" });
                            return interaction.user.send({ content: cmdx.Responce }).catch((e) => {
                                client.errNormal(
                                    {
                                        error: "I can't DM you, maybe you have DM turned off!",
                                        type: 'ephemeral'
                                    },
                                    interaction,
                                );
                            });
                        }
                    }
                }
                if (interaction.options._subcommand !== null && interaction.options.getSubcommand() == "help") {
                    const cmdInfo = interaction.client.getSlashMentions(interaction.commandName)

                    return client.embed({
                        title: `❓・Help panel`,
                        desc: `Get help with the commands in \`${interaction.commandName}\` \n\n${cmdInfo.map((info) /* array of [cmd_mention, description] */=> `${info[0]} - \`${info[1]}\``).join("\n")}`,
                        type: 'reply'
                    }, interaction)
                }

                if (cmd) cmd.run(client, interaction, interaction.options._hoistedOptions).catch(err => {
                    client.emit("errorCreate", err, interaction.commandName, interaction)
                })
            }
        })
    }

    // Verify system
    if (interaction.isButton() && interaction.customId == "Bot_verify") {
        const data = await verify.findOne({ Guild: interaction.guild.id, Channel: interaction.channel.id });
        if (data) {
            let captcha = new Captcha();

            try {
                var image = new Discord.AttachmentBuilder(captcha.JPEGStream, { name: "captcha.jpeg" });

                interaction.reply({ files: [image], fetchReply: true }).then(function (msg) {
                    const filter = s => s.author.id == interaction.user.id;

                    interaction.channel.awaitMessages({ filter, max: 1 }).then(response => {
                        if (response.first().content === captcha.value) {
                            response.first().delete();
                            msg.delete();

                            client.succNormal({
                                text: "You have been successfully verified!"
                            }, interaction.user).catch(error => { })

                            var verifyUser = interaction.guild.members.cache.get(interaction.user.id);
                            verifyUser.roles.add(data.Role);
                        }
                        else {
                            response.first().delete();
                            msg.delete();

                            client.errNormal({
                                error: "You have answered the captcha incorrectly!",
                                type: 'editreply'
                            }, interaction).then(msgError => {
                                setTimeout(() => {
                                    msgError.delete();
                                }, 2000)
                            })
                        }
                    })
                })
            }
            catch (error) {
                console.log(error)
            }
        }
        else {
            client.errNormal({
                error: "Verify is disabled in this server! Or you are using the wrong channel!",
                type: 'ephemeral'
            }, interaction);
        }
    }

    // Reaction roles button
    if (interaction.isButton()) {
        var buttonID = interaction.customId.split("-");

        if (buttonID[0] == "reaction_button") {
            reactionSchema.findOne({ Message: interaction.message.id }, async (err, data) => {
                if (!data) return;

                const [roleid] = data.Roles[buttonID[1]];

                if (interaction.member.roles.cache.get(roleid)) {
                    interaction.guild.members.cache.get(interaction.user.id).roles.remove(roleid).catch(error => { })

                    interaction.reply({ content: `<@&${roleid}> was removed!`, ephemeral: true });
                }
                else {
                    interaction.guild.members.cache.get(interaction.user.id).roles.add(roleid).catch(error => { })

                    interaction.reply({ content: `<@&${roleid}> was added!`, ephemeral: true });
                }
            })
        }
    }

    // Reaction roles select
    if (interaction.isStringSelectMenu()) {
        if (interaction.customId == "reaction_select") {
            reactionSchema.findOne(
                { Message: interaction.message.id },
                async (err, data) => {
                    if (!data) return;

                    let roles = "";

                    for (let i = 0; i < interaction.values.length; i++) {
                        const [roleid] = data.Roles[interaction.values[i]];

                        roles += `<@&${roleid}> `;

                        if (interaction.member.roles.cache.get(roleid)) {
                            interaction.guild.members.cache
                                .get(interaction.user.id)
                                .roles.remove(roleid)
                                .catch((error) => { });
                        } else {
                            interaction.guild.members.cache
                                .get(interaction.user.id)
                                .roles.add(roleid)
                                .catch((error) => { });
                        }

                        if ((i + 1) === interaction.values.length) {
                            interaction.reply({
                                content: `I have updated the following roles for you: ${roles}`,
                                ephemeral: true,
                            });
                        }
                    }
                }
            );
        }
    }
    // Tickets
    if (interaction.customId == "Bot_openticket") {
        return require(`${process.cwd()}/src/commands/tickets/create.js`)(client, interaction);
    }

    if (interaction.customId == "Bot_closeticket") {
        return require(`${process.cwd()}/src/commands/tickets/close.js`)(client, interaction);
    }

    if (interaction.customId == "Bot_claimTicket") {
        return require(`${process.cwd()}/src/commands/tickets/claim.js`)(client, interaction);
    }

    if (interaction.customId == "Bot_transcriptTicket") {
        return require(`${process.cwd()}/src/commands/tickets/transcript.js`)(client, interaction);
    }

    if (interaction.customId == "Bot_openTicket") {
        return require(`${process.cwd()}/src/commands/tickets/open.js`)(client, interaction);
    }

    if (interaction.customId == "Bot_deleteTicket") {
        return require(`${process.cwd()}/src/commands/tickets/delete.js`)(client, interaction);
    }

    if (interaction.customId == "Bot_noticeTicket") {
        return require(`${process.cwd()}/src/commands/tickets/notice.js`)(client, interaction);
    }

    // Whitelist application - open the modal
    if (interaction.isButton() && interaction.customId === "wl_apply") {
        const wlConfig = await require("../../database/models/whitelistConfig").findOne({ Guild: interaction.guild.id });
        if (!wlConfig) {
            return client.errNormal({
                error: 'The whitelist system is not configured on this server yet',
                type: 'ephemeral'
            }, interaction);
        }

        const modal = new Discord.ModalBuilder()
            .setCustomId('wl_apply_modal')
            .setTitle('Whitelist Application');

        const nameInput = new Discord.TextInputBuilder()
            .setCustomId('wl_name')
            .setLabel('RP Name (Firstname Lastname)')
            .setPlaceholder('Michael Carter')
            .setStyle(Discord.TextInputStyle.Short)
            .setRequired(true);

        const ageInput = new Discord.TextInputBuilder()
            .setCustomId('wl_age')
            .setLabel('Age')
            .setPlaceholder('18')
            .setStyle(Discord.TextInputStyle.Short)
            .setRequired(true);

        const storyInput = new Discord.TextInputBuilder()
            .setCustomId('wl_story')
            .setLabel('Backstory / Bio')
            .setPlaceholder('Tell us about your character...')
            .setStyle(Discord.TextInputStyle.Paragraph)
            .setRequired(true);

        modal.addComponents(
            new Discord.ActionRowBuilder().addComponents(nameInput),
            new Discord.ActionRowBuilder().addComponents(ageInput),
            new Discord.ActionRowBuilder().addComponents(storyInput),
        );

        return interaction.showModal(modal);
    }

    // Whitelist application - handle the submitted modal
    if (interaction.isModalSubmit() && interaction.customId === "wl_apply_modal") {
        const wlConfig = await require("../../database/models/whitelistConfig").findOne({ Guild: interaction.guild.id });
        if (!wlConfig) {
            return client.errNormal({
                error: 'The whitelist system is not configured on this server yet',
                type: 'ephemeral'
            }, interaction);
        }

        const reviewChannel = interaction.guild.channels.cache.get(wlConfig.ReviewChannel);
        if (!reviewChannel) {
            return client.errNormal({
                error: 'The configured review channel no longer exists, please contact an admin',
                type: 'ephemeral'
            }, interaction);
        }

        const rpName = interaction.fields.getTextInputValue('wl_name');
        const age = interaction.fields.getTextInputValue('wl_age');
        const story = interaction.fields.getTextInputValue('wl_story');

        const reviewEmbed = client.templateEmbed()
            .setTitle('📥・New Whitelist Application')
            .setThumbnail(interaction.user.displayAvatarURL({ size: 512 }))
            .addFields(
                { name: '👤┆Applicant', value: `<@${interaction.user.id}> (${interaction.user.tag})`, inline: false },
                { name: '📝┆RP Name', value: rpName, inline: true },
                { name: '🎂┆Age', value: age, inline: true },
                { name: '📖┆Backstory', value: story.length > 1000 ? story.slice(0, 1000) + '...' : story, inline: false },
            );

        const reviewRow = new Discord.ActionRowBuilder()
            .addComponents(
                new Discord.ButtonBuilder()
                    .setCustomId(`wl_accept-${interaction.user.id}`)
                    .setLabel('Accept')
                    .setEmoji('✅')
                    .setStyle(Discord.ButtonStyle.Success),
                new Discord.ButtonBuilder()
                    .setCustomId(`wl_deny-${interaction.user.id}`)
                    .setLabel('Deny')
                    .setEmoji('❌')
                    .setStyle(Discord.ButtonStyle.Danger),
            );

        await reviewChannel.send({ embeds: [reviewEmbed], components: [reviewRow] });

        return client.succNormal({
            text: 'Your whitelist application has been submitted! You will be DMed once staff review it.',
            type: 'ephemeral'
        }, interaction);
    }

    // Whitelist application - accept / deny buttons
    if (interaction.isButton() && (interaction.customId.startsWith("wl_accept-") || interaction.customId.startsWith("wl_deny-"))) {
        if (!interaction.memberPermissions.has(Discord.PermissionFlagsBits.ManageRoles)) {
            return client.errNormal({
                error: 'You need the "Manage Roles" permission to review applications',
                type: 'ephemeral'
            }, interaction);
        }

        const [action, applicantId] = interaction.customId.split('-');
        const isAccept = action === 'wl_accept';

        const wlConfig = await require("../../database/models/whitelistConfig").findOne({ Guild: interaction.guild.id });
        const applicant = await interaction.guild.members.fetch(applicantId).catch(() => null);

        if (isAccept && applicant && wlConfig?.Role) {
            await applicant.roles.add(wlConfig.Role).catch(() => { });
        }

        if (applicant) {
            applicant.send(
                isAccept
                    ? `✅ Your whitelist application in **${interaction.guild.name}** has been **accepted**! Welcome aboard.`
                    : `❌ Your whitelist application in **${interaction.guild.name}** has been **denied**. You may re-apply later.`
            ).catch(() => { });
        }

        const oldEmbed = interaction.message.embeds[0];
        const updatedEmbed = Discord.EmbedBuilder.from(oldEmbed)
            .setColor(isAccept ? client.config.colors.succes : client.config.colors.error)
            .addFields({ name: isAccept ? '✅┆Accepted by' : '❌┆Denied by', value: `<@${interaction.user.id}>`, inline: false });

        return interaction.update({ embeds: [updatedEmbed], components: [] });
    }
}

