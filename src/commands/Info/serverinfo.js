const moment = require('moment');
const stripIndents = require('common-tags').stripIndents;

const verificationLevels = ['None', 'Low', 'Medium', '(╯°□°）╯︵ ┻━┻'];

exports.run = (bot, msg, args) => {
    if (!msg.guild)
        throw bot.consts.phrase('guild_only');

    bot.utils.assertEmbedPermission(msg.channel, msg.member);

    let embed;

    if (args.length) {
        if (/^r(oles)?$/i.test(args[0])) {
            const roles = msg.guild.roles.sort((a, b) => b.position - a.position);
            embed = bot.utils.formatLargeEmbed('', bot.consts.phrase('self_destruct_in_t', { t: '60 seconds' }),
                {
                    delimeter: ', ',
                    children: roles.map(r => r.name)
                }
            ).setAuthor(`Roles of ${msg.guild.name} [${msg.guild.roles.size}]`, msg.guild.iconURL);
        } else {
            throw bot.consts.phrase('invalid_action');
        }
    } else {
        embed = bot.utils.formatEmbed('', stripIndents`
            ${bot.consts.phrase('self_destruct_in_t', { t: '60 seconds' })}

            ${msg.guild.large ? bot.consts.phrase('lg_role_members') : ''}
            `,
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
                            name: 'Verification level',
                            value: verificationLevels[msg.guild.verificationLevel]
                        }
                    ]
                },
                {
                    title: 'Stats',
                    fields: [
                        {
                            name: `Members [${msg.guild.memberCount}]`,
                            value: `${msg.guild.members.filter(m => m.presence.status !== 'offline').size} online`
                        },
                        {
                            name: `Channels [${msg.guild.channels.size}]`,
                            value: `${msg.guild.channels.filter(m => m.type === 'text').size} Text | ${msg.guild.channels.filter(m => m.type === 'voice').size} Voice`
                        }
                    ]
                },
                {
                    title: `Guild Roles [${msg.guild.roles.size}]`,
                    fields: [
                        {
                            value: `To see a list with all roles, use \`${bot.config.prefix}serverinfo roles\` command.`
                        }
                    ]
                }
            ],
            {
                thumbnail: msg.guild.iconURL
            }
        ).setAuthor(msg.guild.name, msg.guild.iconURL);
    }

    msg.edit(msg.content, { embed: embed }).then(m => m.delete(60000)).catch(msg.error);
};

exports.info = {
    name: 'serverinfo',
    usage: 'serverinfo [roles]',
    description: 'Shows info of the server you are in',
    aliases: ['server']
};
