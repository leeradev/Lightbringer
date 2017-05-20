exports.run = (bot, msg, args) => {
    if (args.length < 1) {
        throw bot.consts.phrase('empty_search');
    }

    const parsed = bot.utils.parseArgs(args, ['i']);

    msg.edit(`**Wow!** ➔\u2000http://www.lmgtfy.com/?iie=${parsed.options.i ? 1 : 0}&q=${parsed.leftover.join('+')}`);
};

exports.info = {
    name: 'lmgtfy',
    usage: 'lmgtfy [search text]',
    description: 'Links to LMGTFY with the given search text',
    options: [
        {
            name: '-i',
            usage: '-i',
            description: 'Enables Internet Explainer'
        }
    ]
};
