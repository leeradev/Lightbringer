const snekfetch = require('snekfetch');

exports.run = (bot, msg, args) => {
    if (args.length < 1)
        throw bot.consts.phrase('require_type', { suf: ' Available types: `date`, `math` and `year`.' });

    const type = (/^d(ate)?$/i.test(args[0]) ? 'date' : (/^m(ath)?$/i.test(args[0]) ? 'math' : (/^y(ear)?$/i.test(args[0]) ? 'year' : false)));

    if (!type)
        throw 'That type is not available!';

    snekfetch.get(`http://numbersapi.com/random/${type}?json`).then(res => {
        if (!res || !res.body)
            return msg.error('Could not fetch data');

        msg.edit(res.body.text);
    });
};

exports.info = {
    name: 'numbersapi',
    usage: 'numbersapi <date|math|year>',
    description: 'Gives a random fact from http://numbersapi.com/random',
    aliases: ['fact']
};
