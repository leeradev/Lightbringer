const stripIndents = require('common-tags').stripIndents;

exports.run = (bot, msg, args) => {
    if (!msg.guild)
        throw bot.consts.phrase('guild_only');

    bot.utils.assertEmbedPermission(msg.channel, msg.member);

    if (args.length < 1)
        throw bot.consts.phrase('specify_role');

    const keyword = args.join(' ');
    const role = bot.utils.getGuildRole(msg.guild, keyword);

    msg.edit(msg.content, { embed:
        bot.utils.formatLargeEmbed('', stripIndents`
            ${bot.consts.phrase('self_destruct_in_t', { t: '60 seconds' })}

            ${msg.guild.large ? bot.consts.phrase('lg_role_members') : ''}
            `,
            {
                delimeter: ', ',
                children: role.members.map(m => m.user.tag)
            }
        ).setAuthor(`Members of ${role.name} role [${role.members.size}]`, msg.guild.iconURL)
    }).then(m => m.delete(60000)).catch(msg.error);
};

exports.info = {
    name: 'inrole',
    usage: 'inrole <role name>',
    description: 'Shows a list of members which have the specified role'
};
