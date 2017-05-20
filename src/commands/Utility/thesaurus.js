const saurus = require('saurus');

exports.run = (bot, msg, args) => {
    if (msg.guild)
        bot.utils.assertEmbedPermission(msg.channel, msg.member);

    const parsed = bot.utils.parseArgs(args, ['a']);

    if (parsed.leftover.length < 1)
        throw bot.consts.phrase('empty_search');

    const prev = msg.content;
    const useAntonyms = parsed.options.a;
    const query = parsed.leftover.join(' ');

    msg.edit(bot.consts.phrase('searching_x_on_y', { x: query, y: 'Thesaurus.com' })).then(() => {
        saurus(query).then(resp => {
            if (!resp)
                return msg.error(bot.consts.phrase('no_matches'));

            if (useAntonyms && (!resp.antonyms || !resp.antonyms.length))
                return msg.error(`No antonyms found for \`${query}\``);
            else if (!useAntonyms && (!resp.synonyms || !resp.synonyms.length))
                return msg.error(`No synonyms found for \`${query}\``);

            msg.edit(prev, {
                embed: bot.utils.embed(
                    `${useAntonyms ? 'Antonyms' : 'Synonyms'} of ${query}`, (useAntonyms ? resp.antonyms : resp.synonyms).join(', '), [],
                    {
                        footer: 'Thesaurus.com',
                        footerIcon: 'https://a.safe.moe/VhreL.png',
                        color: '#fba824'
                    }
                )
            }).catch(msg.error);
        });
    });
};

exports.info = {
    name: 'thesaurus',
    usage: 'thesaurus [options] <query>',
    description: 'Looks up a word on Thesaurus.com (showing synonyms by default)',
    aliases: ['syn', 'synonyms'],
    options: [
        {
            name: '-a',
            usage: '-a',
            description: 'Shows antonyms instead'
        }
    ]
};
