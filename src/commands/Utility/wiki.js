const wiki = require('wikijs').default;

exports.run = (bot, msg, args) => {
    if (msg.guild)
        bot.utils.assertEmbedPermission(msg.channel, msg.member);

    if (args.length < 1)
        throw bot.consts.phrase('empty_search');

    const prev = msg.content;
    const query = args.join(' ');

    msg.edit(bot.consts.phrase('searching_x_on_y', { x: query, y: 'Wikipedia' })).then(() => {
        wiki().search(query, 1).then(data => {
            wiki().page(data.results[0]).then(page => {
                page.summary().then(summary => {
                    msg.edit(prev, { embed:
                        bot.utils.embed(
                            page.raw.title, summary.toString().replace(/\n/g, '\n\n'),
                            [
                                {
                                    name: 'Link',
                                    value: `**${page.raw.fullurl}**`
                                }
                            ],
                            {
                                footer: 'Wikipedia',
                                footerIcon: 'https://a.safe.moe/8GCNj.png',
                                color: '#c7c8ca'
                            }
                        )
                    }).catch(msg.error);
                });
            });
        }, msg.error);
    });
};

exports.info = {
    name: 'wiki',
    usage: 'wiki <query>',
    description: 'Returns the summary of the first matching search result from Wikipedia',
    aliases: ['w', 'wikipedia']
};
