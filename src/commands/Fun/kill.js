exports.run = (bot, msg) => {
    if (msg.mentions.users.size < 1)
        throw bot.consts.phrase('mention_to_x', { x: 'kill' });

    msg.edit(msg.mentions.users.map(m => `**${bot.consts.kills[Math.round(Math.random() * (bot.consts.kills.length - 1))].replace(/@/g, m)}**`).join('\n'));
};

exports.info = {
    name: 'kill',
    usage: 'kill <user-1> [user-2] ... [user-n]',
    description: 'Kills some users',
    credits: 'illusorum#8235 (286011141619187712)'
};
