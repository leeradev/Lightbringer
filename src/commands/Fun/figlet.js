const figlet = require('figlet');

exports.run = (bot, msg, args) => {
    if (args.length < 1)
        throw 'You must provide some text to render!';

    figlet.text(args.join(' '), (err, res) => {
        if (err)
            return msg.error(err);

        msg.edit(`${bot.utils.toCode(res)}`);
    });
};

exports.info = {
    name: 'figlet',
    usage: 'figlet <text>',
    description: 'Renders fancy ASCII text'
};
