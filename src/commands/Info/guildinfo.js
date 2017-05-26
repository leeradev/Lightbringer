const moment = require('moment');

const verificationLevels = ['None', 'Low', 'Medium', '(╯°□°）╯︵ ┻━┻'];
const explicitContentFilters = ['No scan', 'Scan from members without a role', 'Scan from all members'];

exports.run = (bot, msg, args) => {
    if (!msg.guild)
        throw bot.consts.phrase('guild_only');

    bot.utils.assertEmbedPermission(msg.channel, msg.member);

    const parsed = bot.utils.parseArgs(args, ['r']);

    bot.utils.fetchGuildMembers(msg.guild, !parsed.options.r).then(res => {
        let embed;
        const textChannels = msg.guild.channels.filter(c => c.type == 'text');
        const voiceChannels = msg.guild.channels.filter(c => c.type == 'voice');

        if (parsed.leftover.length) {
            if (/^r(oles)?$/i.test(parsed.leftover[0])) {
                const sortPos = (a, b) => b.position - a.position;
                const roles = msg.guild.roles.sort(sortPos);
                embed = bot.utils.formatLargeEmbed('', bot.consts.phrase('self_destruct_in_t', { t: '60 seconds' }),
                    {
                        delimeter: ', ',
                        children: roles.map(r => r.name)
                    }
                ).setAuthor(`Roles of ${msg.guild.name} [${msg.guild.roles.size}]`, msg.guild.iconURL);
            } else if (/^m(ember(s)?)?$|^u(ser(s)?)?$/i.test(parsed.leftover[0])) {
                embed = bot.utils.formatLargeEmbed('', bot.consts.phrase('self_destruct_in_t', { t: '60 seconds' }),
                    {
                        delimeter: ', ',
                        children: msg.guild.members.map(m => `${m.user.tag} ${(m.user.bot ? '**`[BOT]`**' : '')}`).sort()
                    }
                ).setAuthor(`Members of ${msg.guild.name} [${msg.guild.memberCount}]`, msg.guild.iconURL);
            } else if (/^c(hannel(s)?)?$/i.test(parsed.leftover[0])) {
                const sortPos = (a, b) => a.position - b.position;
                const children = [].concat(
                    `❯\u2000**Text channels [${textChannels.size}]**\n`,
                    textChannels.sort(sortPos).map(c => `•\u2000${c.name}${!c.permissionsFor(msg.member).has(['READ_MESSAGES', 'READ_MESSAGE_HISTORY']) ? ' `[HIDDEN]`' : ''}`),
                    '\u2000',
                    `❯\u2000**Voice channels [${voiceChannels.size}]**\n`,
                    voiceChannels.sort(sortPos).map(c => `•\u2000${c.name}${!c.permissionsFor(msg.member).has('CONNECT') ? ' `[LOCKED]`' : ''}`)
                );

                embed = bot.utils.formatLargeEmbed('', bot.consts.phrase('self_destruct_in_t', { t: '60 seconds' }),
                    {
                        delimeter: '\n',
                        children
                    }
                ).setAuthor(`Channels of ${msg.guild.name} [${msg.guild.channels.size}]`, msg.guild.iconURL);
            } else {
                throw bot.consts.phrase('invalid_action');
            }
        } else {
            embed = bot.utils.formatEmbed('', bot.consts.phrase('self_destruct_in_t', { t: '60 seconds' }),
                [
                    {
                        title: 'Information',
                        fields: [
                            {
                                name: 'Owner',
                                value: msg.guild.owner ? `${msg.guild.owner.user.tag} (${msg.guild.owner.id})` : msg.guild.ownerID
                            },
                            {
                                name: 'Default channel',
                                value: msg.guild.defaultChannel
                            },
                            {
                                name: 'Created',
                                value: `${moment(msg.guild.createdAt).format(bot.consts.mediumDateFormat)} (${bot.utils.fromNow(msg.guild.createdAt)})`
                            },
                            {
                                name: 'Region',
                                value: msg.guild.region
                            },
                            {
                                name: 'Verification',
                                value: verificationLevels[msg.guild.verificationLevel]
                            },
                            {
                                name: 'Explicit content',
                                value: explicitContentFilters[msg.guild.explicitContentFilter]
                            },
                            {
                                name: 'Splash image',
                                value: msg.guild.splashURL ? `[${bot.utils.getHostName(msg.guild.splashURL) || 'Click here'}](${msg.guild.splashURL})` : 'N/A'
                            }
                        ]
                    },
                    {
                        title: `Channels [${msg.guild.channels.size}]`,
                        fields: [
                            {
                                name: 'Text',
                                value: textChannels.size
                            },
                            {
                                name: 'Voice',
                                value: voiceChannels.size
                            },
                            {
                                value: ''
                            },
                            {
                                value: `Lists all channels with \`${bot.config.prefix}serverinfo channels\` command.`
                            }
                        ]
                    },
                    {
                        title: `Members [${msg.guild.memberCount}] - ${msg.guild.members.filter(m => m.presence.status !== 'offline').size} online`,
                        fields: [
                            {
                                value: `Lists all members with \`${bot.config.prefix}serverinfo members\` command.`
                            }
                        ]
                    },
                    {
                        title: `Guild roles [${msg.guild.roles.size}]`,
                        fields: [
                            {
                                value: `Lists all guild roles with \`${bot.config.prefix}serverinfo roles\` command.`
                            }
                        ]
                    }
                ],
                {
                    thumbnail: msg.guild.iconURL
                }
            ).setAuthor(msg.guild.name, msg.guild.iconURL);
        }

        if (res.time)
            embed.setFooter(bot.consts.phrase('time_taken_to_rfm', { t: res.time }));

        msg.edit(msg.content, { embed: embed }).then(m => m.delete(60000)).catch(msg.error);
    }).catch(msg.error);
};

exports.info = {
    name: 'guildinfo',
    usage: 'guildinfo [roles|members|channels]',
    description: 'Shows info of the server you are in',
    aliases: ['guild', 'server', 'serverinfo'],
    options: [
        {
            name: '-r',
            usage: '-r',
            description: 'Re-fetches all guild members (recommended with large guild)'
        }
    ]
};
