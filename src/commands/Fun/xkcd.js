const xkcd = require('xkcd-imgs');

exports.run = (bot, msg) => {
    if (msg.guild)
        bot.utils.assertEmbedPermission(msg.channel, msg.member);

    const prev = msg.content;

    msg.edit('🔄').then(() => {
        xkcd.img((err, res) => {
            if (err)
                return msg.error(err);

            msg.edit(prev, { embed:
                bot.utils.embed('', res.title, [], { url: res.url })
            });
        });
    });
};

exports.info = {
    name: 'xkcd',
    usage: 'xkcd',
    description: 'Shows you random xkcd comics'
};
