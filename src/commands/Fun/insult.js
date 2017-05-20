exports.run = (bot, msg) => {
    if (msg.mentions.users.size < 1)
        throw bot.consts.phrase('mention_to_x', { x: 'insult' });

    msg.edit(msg.mentions.users.map(m => `**${bot.consts.insults[Math.round(Math.random() * (bot.consts.insults.length - 1))].replace(/@/g, m)}**`).join('\n'));
};

exports.info = {
    name: 'insult',
    usage: 'insult <user-1> [user-2] ... [user-n]',
    description: 'Insults some users',
    credits: 'Twentysix#5252'
};
