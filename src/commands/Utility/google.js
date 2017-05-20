const request = require('request');
const cheerio = require('cheerio');

const getText = (children) => {
    if (children.children) return getText(children.children);
    return children.map(c => {
        return c.children ? getText(c.children) : c.data;
    }).join('');
};

exports.run = (bot, msg, args) => {
    if (msg.guild)
        bot.utils.assertEmbedPermission(msg.channel, msg.member);

    if (args.length < 1)
        throw bot.consts.phrase('empty_search');

    const prev = msg.content;

    msg.edit(bot.consts.phrase('searching_x_on_y', { x: args.join(' '), y: 'Google' })).then(() => {
        request.get('http://google.com/search?client=chrome&rls=en&ie=UTF-8&oe=UTF-8&q=' + args.join('+'), (err, res, body) => {
            if (err || res.statusCode !== 200)
                return msg.edit(`⛔\u2000Error! (${res.statusCode}): ${res.statusMessage}`);

            const $ = cheerio.load(body);
            const results = [];
            $('.g').each((i) => {
                results[i] = {};
            });
            $('.g>.r>a').each((i, e) => {
                const raw = e.attribs['href'];
                results[i]['link'] = raw.substr(7, raw.indexOf('&sa=U') - 7);
            });
            $('.g>.s>.st').each((i, e) => {
                results[i]['description'] = getText(e);
            });

            const output = results.filter(r => r.link && r.description)
                .slice(0, 5)
                .map(r => `${r.link}\n\t${r.description}\n`)
                .join('\n');

            msg.edit(prev, { embed:
                bot.utils.embed(`Search results for "${args.join(' ')}"`, output, [], {
                    footer: 'Google',
                    footerIcon: 'https://a.safe.moe/F3RvU.png',
                    color: '#4285f4'
                })
            });
        });
    });
};

exports.info = {
    name: 'google',
    usage: 'google <search>',
    description: 'Searches Google using magic'
};
