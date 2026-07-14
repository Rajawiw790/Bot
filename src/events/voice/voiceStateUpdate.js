const Discord = require('discord.js');
const voiceSchema = require("../../database/models/voice");
const channelSchema = require("../../database/models/voiceChannels");

module.exports = async (client, oldState, newState) => {
    if (oldState.channelId == newState.channelId) {
        if (oldState.serverDeaf == false && newState.selfDeaf == true) return;
        if (oldState.serverDeaf == true && newState.selfDeaf == false) return;
        if (oldState.serverMute == false && newState.serverMute == true) return;
        if (oldState.serverMute == true && newState.serverMute == false) return;
        if (oldState.selfDeaf == false && newState.selfDeaf == true) return;
        if (oldState.selfDeaf == true && newState.selfDeaf == false) return;
        if (oldState.selfMute == false && newState.selfMute == true) return;
        if (oldState.selfMute == true && newState.selfMute == false) return;
        if (oldState.selfVideo == false && newState.selfVideo == true) return;
        if (oldState.selfVideo == true && newState.selfVideo == false) return;
        if (oldState.streaming == false && newState.streaming == true) return;
        if (oldState.streaming == true && newState.streaming == false) return;
    }

    var guildID = newState.guild.id || oldState.guild.id;

    try {
        const data = await voiceSchema.findOne({ Guild: guildID });

        if (data) {
            try {
                const data2 = await channelSchema.findOne({ Guild: guildID, Channel: oldState.channelId });

                if (data2) {
                    let channel = client.channels.cache.get(data2.Channel);
                    let memberCount = channel.members.size;

                    if (memberCount < 1 || memberCount == 0) {
                        if (data.ChannelCount) {
                            try {
                                try {
                                    data.ChannelCount -= 1;
                                    data.save().catch(e => { });
                                }
                                catch { }
                            }
                            catch { }
                        }

                        try {
                            var remove = await channelSchema.deleteOne({ Channel: oldState.channelID });
                            return oldState.channel.delete().catch(e => { });
                        }
                        catch { }
                    }
                }
                        } catch (err) { console.error(err); }

            const user = await client.users.fetch(newState.id);
            const member = newState.guild.members.cache.get(user.id);

            try {
                if (newState.channel.id === data.Channel) {
                    try {
                        const data2 = await channelSchema.findOne({ Guild: guildID, Channel: oldState.channelId });

                        if (data2) {
                            let channel = client.channels.cache.get(data2.Channel);
                            let memberCount = channel.members.size;

                            if (memberCount < 1 || memberCount == 0) {
                                if (data.ChannelCount) {
                                    try {
                                        data.ChannelCount -= 1;
                                        data.save().catch(e => { });
                                    }
                                    catch { }
                                }

                                try {
                                    var remove = await channelSchema.deleteOne({ Channel: oldState.channelId });
                                    return oldState.channel.delete().catch(e => { });
                                }
                                catch { }
                            }
                        }
                                        } catch (err) { console.error(err); }

                    if (data.ChannelCount) {
                        data.ChannelCount += 1;
                        data.save();
                    }
                    else {
                        data.ChannelCount = 1;
                        data.save();
                    }

                    let channelName = data.ChannelName;
                    channelName = channelName.replace(`{emoji}`, "🔊")
                    channelName = channelName.replace(`{channel name}`, `Voice ${data.ChannelCount}`)
                    channelName = channelName.replace(`{channel count}`, `${data.ChannelCount}`)
                    channelName = channelName.replace(`{member}`, `${user.username}`)
                    channelName = channelName.replace(`{member tag}`, `${user.tag}`)

                    const channel = await newState.guild.channels.create({
                        name: "⌛",
                        type:  Discord.ChannelType.GuildVoice,
                        parent: data.Category,
                    });

                    if (member.voice.setChannel(channel)) {
                        channel.edit({ name: channelName })
                    }

                    new channelSchema({
                        Guild: guildID,
                        Channel: channel.id,
                    }).save();
                }
                else {
                    try {
                        const data2 = await channelSchema.findOne({ Guild: guildID, Channel: oldState.channelID });

                        if (data2) {
                            let channel = client.channels.cache.get(data2.Channel);
                            let memberCount = channel.members.size;

                            if (memberCount < 1 || memberCount == 0) {
                                if (data.ChannelCount) {
                                    try {
                                        data.ChannelCount -= 1;
                                        data.save().catch(e => { });
                                    }
                                    catch { }
                                }

                                try {
                                    var remove = await channelSchema.deleteOne({ Channel: oldState.channelID });
                                    return oldState.channel.delete().catch(e => { });
                                }
                                catch { }
                            }
                        }
                                        } catch (err) { console.error(err); }
                }
            }
            catch { }
        }
        } catch (err) { console.error(err); }
}