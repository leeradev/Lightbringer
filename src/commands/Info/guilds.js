exports.run = (bot, msg) => {
    if (msg.guild)
        bot.utils.assertEmbedPermission(msg.channel, msg.member);

    msg.edit(msg.content, { embed:
        bot.utils.formatLargeEmbed('', bot.consts.phrase('self_destruct_in_t', { t: '240 seconds' }),
            {
                delimeter: '\n',
                children: bot.guilds.sort((a, b) => b.memberCount - a.memberCount).map(g => `•\u2000**${g.name}** - ${g.memberCount} member${g.memberCount != 1 ? 's' : ''}, ${g.channels.size} channel${g.channels.size ? 's' : ''}`)
            },
            {
                inline: false
            }
        ).setAuthor(`${bot.user.username}'s guilds [${bot.guilds.size}]`, bot.user.displayAvatarURL)
    }).then(m => m.delete(240000)).catch(msg.error);
};

exports.info = {
    name: 'guilds',
    usage: 'guilds',
    description: 'Lists all guilds that you\'re a member of',
    aliases: ['servers']
};
