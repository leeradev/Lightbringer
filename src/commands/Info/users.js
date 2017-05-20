const stripIndents = require('common-tags').stripIndents;

exports.run = (bot, msg) => {
    if (!msg.guild)
        throw bot.consts.phrase('guild_only');

    /* NOTE: Depending on the amount of members, a single embed may not be enough and the list will be cropped.
             A single embed should be enough for a bit over 1000 members though. */
    msg.edit(msg.content, { embed:
        bot.utils.formatLargeEmbed('', stripIndents`
            ${bot.consts.phrase('self_destruct_in_t', { t: '60 seconds' })}

            ${msg.guild.large ? bot.consts.phrase('lg_role_members') : ''}
            `,
            {
                delimeter: ', ',
                children: msg.guild.members.map(m => `${m.user.tag} ${(m.user.bot ? '**`[BOT]`**' : '')}`).sort()
            }
        ).setAuthor(`Members of ${msg.guild.name} [${msg.guild.members.size} / ${msg.guild.memberCount}]`, msg.guild.iconURL)
    }).then(m => m.delete(60000)).catch(msg.error);
};

exports.info = {
    name: 'users',
    usage: 'users',
    description: 'Lists all users on your current server'
};
