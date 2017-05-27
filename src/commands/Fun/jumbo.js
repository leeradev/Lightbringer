exports.run = (bot, msg, args) => {
    const parsed = bot.utils.parseArgs(args, ['k']);

    if (parsed.leftover.length < 1)
        throw 'You must enter at least one emoji!';

    const files = parsed.leftover.map(a => {
        const emoji = bot.emojis.find(e => e == a);

        if (emoji) {
            if (!parsed.options.k)
                parsed.leftover.splice(parsed.leftover.indexOf(a), 1);

            return emoji;
        }
    }).filter(e => e).map(e => {
        return {
            attachment: e.url,
            name: `${e.name}-${e.id}.png`
        };
    });

    if (files.length < 1)
        throw 'Could not parse emojis!';

    msg.channel.send(parsed.leftover.join(' '), { files }).then(() => msg.delete());
};

exports.info = {
    name: 'jumbo',
    usage: 'jumbo [-k] <emojis>',
    description: 'Sends the emojis as image attachments',
    aliases: ['j', 'large'],
    options: [
        {
            name: '-k',
            usage: '-k',
            description: 'Keep emojis in the chat content'
        }
    ]
};
