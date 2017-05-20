const oneLine = require('common-tags').oneLine;

exports.run = (bot, msg) => {
    if (msg.guild)
        bot.utils.assertEmbedPermission(msg.channel, msg.member);

    const servers = bot.guilds.array().sort((a, b) => b.memberCount - a.memberCount).map(guild => {
        return {
            name: guild.name,
            value: oneLine`
                ${guild.memberCount} user${guild.memberCount == 1 ? 's' : ''},
                ${guild.channels.size} channel${guild.channels.size == 1 ? 's' : ''}
            `
        };
    });

    msg.edit({ embed:
        bot.utils.embed(`${bot.user.username}'s Servers [${bot.guilds.size}]`, '\u200b', servers, { inline: true })
    }).catch(msg.error);
};

exports.info = {
    name: 'guilds',
    usage: 'guilds',
    description: 'Lists all guilds that you\'re a member of',
    aliases: ['servers']
};
