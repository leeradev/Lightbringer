exports.run = (bot, msg, args) => {
    if (!msg.guild)
        throw bot.consts.phrase('guild_only');

    bot.utils.assertEmbedPermission(msg.channel, msg.member);

    const parsed = bot.utils.parseArgs(args, ['r']);

    if (parsed.leftover.length < 1)
        throw bot.consts.phrase('specify_role');

    const keyword = parsed.leftover.join(' ');
    const role = bot.utils.getGuildRole(msg.guild, keyword);

    bot.utils.fetchGuildMembers(msg.guild, !parsed.options.r).then(res =>
        msg.edit(msg.content, { embed:
            bot.utils.formatLargeEmbed('', bot.consts.phrase('self_destruct_in_t', { t: '60 seconds' }),
                {
                    delimeter: ', ',
                    children: role.members.map(m => m.user.tag)
                },
                {
                    footer: res.time ? bot.consts.phrase('time_taken_to_rfm', { t: res.time }) : ''
                }
            ).setAuthor(`Members of ${role.name} role [${role.members.size}]`, msg.guild.iconURL)
        }).then(m => m.delete(60000)).catch(msg.error)
    ).catch(msg.error);
};

exports.info = {
    name: 'inrole',
    usage: 'inrole <role name>',
    description: 'Shows a list of members which have the specified role',
    options: [
        {
            name: '-r',
            usage: '-r',
            description: 'Re-fetches all guild members (recommended with large guild)'
        }
    ]
};
