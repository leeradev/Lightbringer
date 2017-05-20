exports.run = (bot, msg) => {
    if (msg.mentions.users.size < 1)
        throw bot.consts.phrase('mention_to_x', { x: 'shoot' });

    msg.edit(`**${bot.user.username} is on a killing spree!**\n` + msg.mentions.users.map(m => `${m} 🔫`).join('\n'));
};

exports.info = {
    name: 'shoot',
    usage: 'shoot <user>',
    description: 'Shoots the user you mention'
};
