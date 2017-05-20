const giphy = require('giphy-api')();

exports.run = (bot, msg, args) => {
    const parsed = bot.utils.parseArgs(args, ['u']);

    if (parsed.leftover.length < 1)
        throw 'You must provide something to search for!';

    msg.edit('🔄').then(() => {
        giphy.random(`${parsed.leftover.join(' ')}`, (err, res) => {
            if (err)
                return msg.error(err);

            if (!res.data.url)
                return msg.error(bot.consts.phrase('no_matches'));

            const key = res.data.url.substr(res.data.url.lastIndexOf('-') + 1);
            const url = `https://media.giphy.com/media/${key}/giphy.gif`;

            if (parsed.options.u)
                msg.channel.send({ files: [ url ]}).then(() => msg.delete()).catch(msg.error);
            else
                msg.edit(url);
        });
    });
};

exports.info = {
    name: 'gif',
    usage: 'gif [-u] <query>',
    description: 'Searches Giphy for GIFs',
    aliases: ['giphy'],
    options: [
        {
            name: '-u',
            usage: '-u',
            description: 'Attempts to send the image as an attachment instead'
        }
    ]
};
