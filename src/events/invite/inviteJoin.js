const discord = require('discord.js');

const invites = require("../../database/models/invites");
const invitedBy = require("../../database/models/inviteBy");
const welcomeSchema = require("../../database/models/welcomeChannels");
const messages = require("../../database/models/inviteMessages");
const rewards = require("../../database/models/inviteRewards");


module.exports = async (client, member, invite, inviter) => {
    const messageData = await messages.findOne({ Guild: member.guild.id });

    if (!invite || !inviter) {
        if (messageData && messageData.inviteJoin) {
            var joinMessage = messageData.inviteJoin;
            joinMessage = joinMessage.replace(`{user:username}`, member.user.username)
            joinMessage = joinMessage.replace(`{user:discriminator}`, member.user.discriminator)
            joinMessage = joinMessage.replace(`{user:tag}`, member.user.tag)
            joinMessage = joinMessage.replace(`{user:mention}`, member)

            joinMessage = joinMessage.replace(`{inviter:username}`, "System")
            joinMessage = joinMessage.replace(`{inviter:discriminator}`, "#0000")
            joinMessage = joinMessage.replace(`{inviter:tag}`, "System#0000")
            joinMessage = joinMessage.replace(`{inviter:mention}`, "System")
            joinMessage = joinMessage.replace(`{inviter:invites}`, "∞")
            joinMessage = joinMessage.replace(`{inviter:invites:left}`, "∞")

            joinMessage = joinMessage.replace(`{guild:name}`, member.guild.name)
            joinMessage = joinMessage.replace(`{guild:members}`, member.guild.memberCount)

            try {
                const channelData = await welcomeSchema.findOne({ Guild: member.guild.id });

                if (channelData) {

                    var channel = member.guild.channels.cache.get(channelData.Channel)

                    await client.embed({
                        title: `👋・Welcome`,
                        desc: joinMessage
                    }, channel).catch(() => { })
                }
                        } catch (err) { console.error(err); }
        } else {
            try {
                const channelData = await welcomeSchema.findOne({ Guild: member.guild.id });

                if (channelData) {

                    var channel = member.guild.channels.cache.get(channelData.Channel)

                    client.embed({
                        title: `👋・Welcome`,
                        desc: `I cannot trace how **${member} | ${member.user.tag}** has been joined`
                    }, channel).catch(() => { })
                }
                        } catch (err) { console.error(err); }
        }
    }
    else {
        const data = await invites.findOne({ Guild: member.guild.id, User: inviter.id });

        if (data) {
            data.Invites += 1;
            data.Total += 1;
            data.save();

            if (messageData) {
                var joinMessage = messageData.inviteJoin;
                joinMessage = joinMessage.replace(`{user:username}`, member.user.username)
                joinMessage = joinMessage.replace(`{user:discriminator}`, member.user.discriminator)
                joinMessage = joinMessage.replace(`{user:tag}`, member.user.tag)
                joinMessage = joinMessage.replace(`{user:mention}`, member)

                joinMessage = joinMessage.replace(`{inviter:username}`, inviter.username)
                joinMessage = joinMessage.replace(`{inviter:discriminator}`, inviter.discriminator)
                joinMessage = joinMessage.replace(`{inviter:tag}`, inviter.tag)
                joinMessage = joinMessage.replace(`{inviter:mention}`, inviter)
                joinMessage = joinMessage.replace(`{inviter:invites}`, data.Invites)
                joinMessage = joinMessage.replace(`{inviter:invites:left}`, data.Left)

                joinMessage = joinMessage.replace(`{guild:name}`, member.guild.name)
                joinMessage = joinMessage.replace(`{guild:members}`, member.guild.memberCount)

                try {
                    const channelData = await welcomeSchema.findOne({ Guild: member.guild.id });

                    if (channelData) {

                        var channel = member.guild.channels.cache.get(channelData.Channel)

                        await client.embed({
                            title: `👋・Welcome`,
                            desc: joinMessage
                        }, channel).catch(() => { })
                    }
                                } catch (err) { console.error(err); }
            }
            else {
                try {
                    const channelData = await welcomeSchema.findOne({ Guild: member.guild.id });

                    if (channelData) {

                        var channel = member.guild.channels.cache.get(channelData.Channel)

                        client.embed({
                            title: `👋・Welcome`,
                            desc: `**${member} | ${member.user.tag}** was invited by ${inviter.tag} **(${data.Invites} invites)**`
                        }, channel)
                    }
                                } catch (err) { console.error(err); }
            }

            try {
                const data = await rewards.findOne({ Guild: member.guild.id, Invites: data.Invites });

                if (data) {
                    try {
                        var role = member.guild.roles.cache.get(data.Role);
                        member.roles.add(role);
                    }
                    catch { }
                }
                        } catch (err) { console.error(err); }
        }
        else {
            new invites({
                Guild: member.guild.id,
                User: inviter.id,
                Invites: 1,
                Total: 1,
                Left: 0
            }).save();

            if (messageData) {
                var joinMessage = messageData.inviteJoin;
                joinMessage = joinMessage.replace(`{user:username}`, member.user.username)
                joinMessage = joinMessage.replace(`{user:discriminator}`, member.user.discriminator)
                joinMessage = joinMessage.replace(`{user:tag}`, member.user.tag)
                joinMessage = joinMessage.replace(`{user:mention}`, member)

                joinMessage = joinMessage.replace(`{inviter:username}`, inviter.username)
                joinMessage = joinMessage.replace(`{inviter:discriminator}`, inviter.discriminator)
                joinMessage = joinMessage.replace(`{inviter:tag}`, inviter.tag)
                joinMessage = joinMessage.replace(`{inviter:mention}`, inviter)
                joinMessage = joinMessage.replace(`{inviter:invites}`, "1")
                joinMessage = joinMessage.replace(`{inviter:invites:left}`, "0")

                joinMessage = joinMessage.replace(`{guild:name}`, member.guild.name)
                joinMessage = joinMessage.replace(`{guild:members}`, member.guild.memberCount)

                try {
                    const channelData = await welcomeSchema.findOne({ Guild: member.guild.id });

                    if (channelData) {

                        var channel = member.guild.channels.cache.get(channelData.Channel)

                        await client.embed({
                            title: `👋・Welcome`,
                            desc: joinMessage
                        }, channel).catch(() => { })
                    }
                                } catch (err) { console.error(err); }
            }
            else {
                try {
                    const channelData = await welcomeSchema.findOne({ Guild: member.guild.id });

                    if (channelData) {

                        var channel = member.guild.channels.cache.get(channelData.Channel)

                        await client.embed({
                            title: `👋・Welcome`,
                            desc: `**${member} | ${member.user.tag}** was invited by ${inviter.tag} **(1 invites)**`
                        }, channel).catch(() => { })
                    }
                                } catch (err) { console.error(err); }
            }
        }

        try {
            const data2 = await invitedBy.findOne({ Guild: member.guild.id });

            if (data2) {
                data2.inviteUser = inviter.id,
                    data2.User = member.id
                data2.save();
            }
            else {
                new invitedBy({
                    Guild: member.guild.id,
                    inviteUser: inviter.id,
                    User: member.id
                }).save();
            }
                } catch (err) { console.error(err); }
    }
};