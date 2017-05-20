const Roll = require('roll');

exports.run = (bot, msg, args) => {
    if (args.length < 1)
        return msg.error('You must specify in dice notation (XdY)');

    let reason = '';
    let footer = '';

    footer += `\🎲\u2000**${args[0]}**`;
    if (args.length > 1) {
        reason = args.splice(1).join(' ');
        footer += ` | ${reason}`;
    }

    const results = new Roll().roll(args[0]);

    msg.channel.send({ embed:
        bot.utils.embed(
            `Total: ${results.result}`, `${[].concat.apply([], results.rolled).join(', ')}`,
            [
                {
                    name: '\u200b',
                    value: footer
                }
            ]
        )
    }).catch(msg.error);
};

exports.info = {
    name: 'roll',
    usage: 'roll XdY <reason>',
    description: 'rolls X dice with Y sides. Supports standard dice notation',
    credits: 'Abyss#0473 (136641861073764352)'
};
