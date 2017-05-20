const webdict = require('webdict');

exports.run = (bot, msg, args) => {
    if (msg.guild)
        bot.utils.assertEmbedPermission(msg.channel, msg.member);

    if (args.length < 1)
        throw bot.consts.phrase('empty_search');

    const prev = msg.content;
    const query = args.join(' ');

    msg.edit(bot.consts.phrase('searching_x_on_y', { x: query, y: 'Dictionary.com' })).then(() => {
        webdict('dictionary', query).then(resp => {
            if (!resp || (resp.statusCode != 200))
                return msg.error(bot.consts.phrase('no_matches'));

            msg.edit(prev, {
                embed: bot.utils.embed(
                    `${query} (${resp.type})`, resp.definition.join('\n'), [],
                    {
                        footer: 'Dictionary.com',
                        footerIcon: 'https://a.safe.moe/9aRrL.png',
                        color: '#4a8fca'
                    }
                )
            }).catch(msg.error);
        });
    });
};

exports.info = {
    name: 'dictionary',
    usage: 'dictionary <query>',
    description: 'Looks up a word on Dictionary.com',
    aliases: ['dict']
};
