const snekfetch = require('snekfetch');

exports.run = (bot, msg, args) => {
    const parsed = bot.utils.parseArgs(args, ['u']);

    if (parsed.leftover.length < 1)
        throw 'You must specify a type!';

    const cats = (/^c(ats)?$/i.test(parsed.leftover[0]) ? true : (/^d(ogs)?$/i.test(parsed.leftover[0]) ? false : null));

    if (cats == null)
        throw 'That type is not available!';

    snekfetch.get(cats ? 'http://www.random.cat/meow' : 'http://random.dog/woof').then(res => {
        try {
            const image = cats ? res.body.file : `http://random.dog/${res.body}`;

            if (parsed.options.u)
                msg.channel.send({ files: [ image ]}).then(() => msg.delete()).catch(msg.error);
            else
                msg.edit(image);
        } catch (e) {
            msg.error(e);
        }
    }).catch(msg.error);
};

exports.info = {
    name: 'random',
    usage: 'random [-u] <cats|dogs>',
    description: 'Shows you pictures of random cats or dogs',
    aliases: ['rand', 'get'],
    options: [
        {
            name: '-u',
            usage: '-u',
            description: 'Attempts to send the image as an attachment instead'
        }
    ]
};
