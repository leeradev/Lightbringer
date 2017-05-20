exports.run = (bot, msg, args) => {
    if (args.length < 1)
        throw 'You must provide some text to convert!';

    msg.edit(
        args.join(' ')
            .toLowerCase()
            .split('')
            .map(c => (bot.consts.emojiMap[c] && typeof bot.consts.emojiMap[c] == 'object' ? bot.consts.emojiMap[c][0] : bot.consts.emojiMap[c]) || c)
            .join(' ')
    );
};

exports.info = {
    name: 'fanceh',
    usage: 'fanceh <text>',
    description: 'Renders text in big emoji letters',
    aliases: ['fancy', 'letters']
};
