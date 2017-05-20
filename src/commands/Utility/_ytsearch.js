// ------------------------------------------------------------------------
// == This command is temporarily disabled until youtube-scrape is fixed ==
// ------------------------------------------------------------------------
const yts = require('youtube-scrape');

exports.run = (bot, msg, args) => {
    if (msg.guild)
        bot.utils.assertEmbedPermission(msg.channel, msg.member);

    if (args.length < 1) {
        throw bot.consts.phrase('empty_search');
    }

    const prev = msg.content;

    msg.edit('🔄').then(() => {

        yts(`${args.join(' ')}`).then(data => {
            if (data && data.results && data.results[0]) {
                const result = data.results[0];

                msg.edit(prev, { embed:
                    bot.utils.embed('', `[${result.title}](${result.link})`, [
                        {
                            name: '👀\u2000Views',
                            value: bot.utils.formatNumber(result.views)
                        },
                        {
                            name: '⌛\u2000Length',
                            value: result.length
                        }
                    ], { image: result.thumbnail })
                });
            } else {
                msg.error(bot.consts.phrase('no_matches'));
            }
        });

    });
};

exports.info = {
    name: 'yt',
    usage: 'yt <query>',
    description: 'Fetches info about a YouTube video'
};
