const moment = require('moment');

exports.run = (bot, msg, args) => {
    if (!msg.guild)
        throw bot.consts.phrase('guild_only');

    bot.utils.assertEmbedPermission(msg.channel, msg.member);

    const parsed = bot.utils.parseArgs(args, ['r']);

    if (parsed.leftover.length < 1)
        throw bot.consts.phrase('specify_role');

    const keyword = parsed.leftover.join(' ');
    const role = bot.utils.getGuildRole(msg.guild, keyword);

    bot.utils.fetchGuildMembers(msg.guild, !parsed.options.r).then(res => {
        const color = hexToRgb(role.hexColor);

        msg.edit(msg.content, { embed:
            bot.utils.formatEmbed('', bot.consts.phrase('self_destruct_in_t', { t: '60 seconds' }),
                [
                    {
                        title: 'Information',
                        fields: [
                            {
                                name: 'ID',
                                value: role.id
                            },
                            {
                                name: 'Created',
                                value: `${moment(role.createdAt).format(bot.consts.mediumDateFormat)} (${bot.utils.fromNow(role.createdAt)})`
                            },
                            {
                                name: 'Position',
                                value: `${msg.guild.roles.size - role.position} / ${msg.guild.roles.size}`
                            },
                            {
                                name: `Members [${role.members.size}]`,
                                value: `${role.members.filter(m => m.presence.status !== 'offline').size} online`
                            }
                        ]
                    },
                    {
                        title: 'Miscellaneous',
                        fields: [
                            {
                                name: 'Hex color',
                                value: role.hexColor
                            },
                            {
                                name: 'RGB color',
                                value: `(${color.r}, ${color.g}, ${color.b})`
                            },
                            {
                                name: 'Hoisted',
                                value: bot.utils.toYesNo(role.hoist)
                            },
                            {
                                name: 'Managed',
                                value: bot.utils.toYesNo(role.managed)
                            },
                            {
                                name: 'Mentionable',
                                value: bot.utils.toYesNo(role.mentionable)
                            }
                        ]
                    }
                ],
                {
                    color: role.hexColor,
                    footer: res.time ? bot.consts.phrase('time_taken_to_rfm', { t: res.time }) : ''
                }
            ).setAuthor(role.name, msg.guild.iconURL)
        }).then(m => m.delete(60000)).catch(msg.error);
    }).catch(msg.error);
};

const hexToRgb = (hex) => {
    const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
    return result ? {
        r: parseInt(result[1], 16),
        g: parseInt(result[2], 16),
        b: parseInt(result[3], 16)
    } : null;
};

exports.info = {
    name: 'roleinfo',
    usage: 'roleinfo <role name>',
    description: 'Shows info of the specified role',
    aliases: ['role'],
    options: [
        {
            name: '-r',
            usage: '-r',
            description: 'Re-fetches all guild members (recommended with large guild)'
        }
    ]
};
