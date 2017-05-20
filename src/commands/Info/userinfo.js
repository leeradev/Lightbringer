const moment = require('moment');

exports.run = (bot, msg, args) => {
    if (!msg.guild)
        throw bot.consts.phrase('guild_only');

    bot.utils.assertEmbedPermission(msg.channel, msg.member);

    const keyword = args.join(' ');

    const get = bot.utils.getGuildMember(msg.guild, keyword, msg.member);
    const member = get[0];
    const user = member.user;

    // Slice off the first item (the @everyone)
    const roles = member.roles.array().slice(1).sort((a, b) => a.comparePositionTo(b)).reverse().map(role => role.name);

    new Promise(resolve => {
        user.fetchProfile().then(profile => {
            resolve(profile);
        }).catch(() => {
            resolve(null);
        });
    }).then(profile => {
        msg.edit(msg.content, { embed:
            bot.utils.formatEmbed('', bot.consts.phrase('self_destruct_in_t', { t: '60 seconds' }),
                [
                    {
                        title: 'User Information',
                        fields: [
                            {
                                name: 'ID',
                                value: user.id
                            },
                            {
                                name: 'Status',
                                value: user.presence.status
                            },
                            {
                                name: user.presence.game && user.presence.game.type ? 'Stream' : 'Game',
                                value: user.presence.game && user.presence.game.name || 'N/A'
                            },
                            {
                                name: 'Created',
                                value: `${moment(user.createdAt).format(bot.consts.mediumDateFormat)} (${bot.utils.fromNow(user.createdAt)})`
                            }
                        ]
                    },
                    {
                        title: 'Miscellaneous',
                        fields: [
                            {
                                name: 'Bot',
                                value: bot.utils.toYesNo(user.bot)
                            },
                            {
                                name: 'Nitro since',
                                value: `${profile && profile.premiumSince ? `${moment(profile.premiumSince).format(bot.consts.mediumDateFormat)} (${bot.utils.fromNow(profile.premiumSince)})` : 'N/A'}`
                            },
                            {
                                name: `${user.id != bot.user.id ? 'Mutual' : 'Total'} guilds`,
                                value: profile ? profile.mutualGuilds.size : '1',
                            }
                        ]
                    },
                    {
                        title: 'Guild Membership',
                        fields: [
                            {
                                name: 'Nickname',
                                value: member.nickname || 'N/A'
                            },
                            {
                                name: 'Joined',
                                value: `${moment(member.joinedAt).format(bot.consts.mediumDateFormat)} (${bot.utils.fromNow(member.joinedAt)})`
                            }
                        ]
                    },
                    {
                        title: `Guild Roles [${roles.length}]`,
                        fields: [
                            {
                                value: roles.length ? roles.join(', ') : 'N/A'
                            }
                        ]
                    }
                ],
                {
                    thumbnail: user.displayAvatarURL
                }
            ).setAuthor(user.tag, user.displayAvatarURL)
        }).then(m => m.delete(60000)).catch(msg.error);
    });
};

exports.info = {
    name: 'userinfo',
    usage: 'userinfo <user>',
    description: 'Shows yours or another user\'s info',
    aliases: ['info']
};
