const urban = require('relevant-urban');

exports.run = (bot, msg, args) => {
    if (msg.guild)
        bot.utils.assertEmbedPermission(msg.channel, msg.member);

    const prev = msg.content;
    const parsed = bot.utils.parseArgs(args, ['i:']);
    const index = parseInt(parsed.options.i) - 1 || 0;
    const keywords = parsed.leftover.join(' ');
    const urbanPromise = !keywords.length ? urban.random() : urban.all(keywords);

    msg.edit(bot.consts.phrase('searching_x_on_y', { x: keywords, y: 'Urban Dictionary' })).then(() => {
        urbanPromise.then((defs) => {
            let def, total;

            switch (defs.constructor.name) {
            case 'Array': // for results from all();
                total = Object.keys(defs).length;

                if (!defs || !total)
                    return msg.error(bot.consts.phrase('no_matches'));

                if (index > total)
                    return msg.error(`Index is out of range (maximum index for this definition is ${total})`);
                else
                    def = defs[index];
                break;
            case 'Definition': // for results from random();
                def = defs;
                break;
            default:
                return msg.error(bot.consts.phrase('no_matches'));
            }

            msg.edit(prev, { embed:
                bot.utils.formatEmbed(
                    `${def.word} by ${def.author} ${total ? ` (${index + 1}/${total})` : ''}`, def.definition,
                    [
                        {
                            title: 'Example(s)',
                            fields: [
                                {
                                    value: def.example ? def.example : 'N/A'
                                }
                            ]
                        },
                        {
                            title: 'Rating',
                            fields: [
                                {
                                    value: `👍\u2000${def.thumbsUp} | 👎\u2000${def.thumbsDown}`
                                }
                            ]
                        },
                        {
                            title: 'Link',
                            fields: [
                                {
                                    value: `**${def.urbanURL}**`
                                }
                            ]
                        }
                    ],
                    {
                        footer: 'Urban Dictionary',
                        footerIcon: 'https://a.safe.moe/1fscn.png',
                        color: '#e86222'
                    }
                )
            }).catch(msg.error);
        }).catch(() => msg.error(bot.consts.phrase('no_matches')));
    });
};

exports.info = {
    name: 'urban',
    usage: 'urban [options] [query]',
    description: 'Looks up a word on Urban Dictionary (leave query blank to get a random definition)',
    aliases: ['u', 'urbandictionary'],
    options: [
        {
            name: '-i',
            usage: '-i <index>',
            description: 'Sets the index of which definition to show'
        }
    ]
};
