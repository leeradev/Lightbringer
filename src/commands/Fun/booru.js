const booru = require('booru');
const isAbsoluteUrl = require('is-absolute-url');

const ratings = {
    's': 'Safe',
    'q': 'Questionable',
    'e': 'Explicit',
    'u': 'N/A'
};

exports.run = (bot, msg, args) => {
    if (msg.guild)
        bot.utils.assertEmbedPermission(msg.channel, msg.member);

    const prev = msg.content;
    const parsed = bot.utils.parseArgs(args, ['s:']);
    const site = parsed.options.s ? parsed.options.s : 'gb';
    const tags = parsed.leftover;

    msg.edit(bot.consts.phrase('searching_x', { x: tags })).then(() => {
        booru.search(site, tags, {
            limit: 1,
            random: true
        }).then(booru.commonfy).then(images => {
            if (images.length < 1) {
                return msg.error('No images found!');
            }

            const image = images[0];
            const imageUrl = bot.utils.cleanUrl(image.common.file_url);
            const imageFull = `[${bot.utils.getHostName(imageUrl) || 'Click here'}](${imageUrl})`;
            const imageSource = image.common.source.length < 1 ? 'N/A' : (isAbsoluteUrl(image.common.source) ? `[${bot.utils.getHostName(image.common.source) || 'Click here'}](${bot.utils.cleanUrl(image.common.source)})` : image.common.source);

            msg.edit(prev, { embed:
                bot.utils.formatEmbed('', '',
                    [
                        {
                            title: 'Information',
                            fields: [
                                {
                                    name: 'Score',
                                    value: image.common.score
                                },
                                {
                                    name: 'Rating',
                                    value: ratings[image.common.rating]
                                },
                                {
                                    name: 'Full',
                                    value: imageFull
                                },
                                {
                                    name: 'Source',
                                    value: imageSource
                                }
                            ]
                        }
                    ],
                    {
                        image: imageUrl,
                        footer: 'Powered by booru library',
                        footerIcon: 'https://a.safe.moe/WnAX6.png',
                        color: '#cb3837'
                    }
                )
            }).catch(msg.error);
        }).catch(err => {
            console.error(err.name === 'booruError' ? err.message : err);
            msg.error('Unexpected error occurred. See console.');
        });
    });
};

exports.info = {
    name: 'booru',
    usage: 'booru [options] [tag1] [tag2]',
    description: 'Search for booru images from various booru sites (looks for a random image from `gelbooru.com` by default)',
    aliases: ['b'],
    options: [
        {
            name: '-s',
            usage: '-s <site>',
            description: 'Choose site for image sourcing (`e621.net`, `e926.net`, `hypnohub.net`, `danbooru.donmai.us`, `konachan.com`, `konachan.net`, `yande.re`, `gelbooru.com`, `rule34.xxx`, `safebooru.org`, `tbib.org`, `xbooru.com`, `youhate.us`, `dollbooru.org`, `rule34.paheal.net` and `lolibooru.moe`)'
        }
    ]
};
