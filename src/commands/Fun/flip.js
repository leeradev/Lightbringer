exports.run = (bot, msg, args) => {
    if (args.length < 1)
        throw 'No texts provided to flip!';

    const content = args.join(' ');

    const flipped = [];
    for (const c of content) {
        flipped.push(bot.consts.flippedChars[c] || c);
    }

    msg.edit(flipped.reverse().join(''));
};

exports.info = {
    name: 'flip',
    usage: 'flip <text>',
    description: 'Flip text',
    credits: '1Computer1'
};
