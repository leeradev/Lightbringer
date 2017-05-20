const snekfetch = require('snekfetch');

const mapping = {
    'e' : { title: 'What happened today in history?', source: 'Events' },
    'b' : { title: 'Who was born today in history?', source: 'Births' },
    'd' : { title: 'Who passed away today in history?', source: 'Deaths' },
};

exports.run = (bot, msg, args) => {
    if (msg.guild)
        bot.utils.assertEmbedPermission(msg.channel, msg.member);

    if (args.length < 1)
        throw 'You must specify a type!';

    const i = (/^e(vents)?$/i.test(args[0]) ? 'e' : (/^b(irths)?$/i.test(args[0]) ? 'b' : (/^d(eaths)?$/i.test(args[0]) ? 'd' : false)));

    if (!i)
        return msg.error('That type is not available!');

    const prev = msg.content;

    snekfetch.get('http://history.muffinlabs.com/date').then(res => {
        if (!res || !res.body)
            return msg.error('Could not fetch data');

        const data = JSON.parse(res.body);

        const title = mapping[i].title;
        console.log(require('util').inspect(data, { depth: 0 }));
        const source = data.data[mapping[i].source];
        const thing = source[Math.round(Math.random() * (source.length - 1))];

        msg.edit(prev, { embed:
            bot.utils.formatEmbed(`${title} (${data.date})`, `${thing.text}`, [
                {
                    title: 'Information',
                    fields: [
                        {
                            name: 'Year',
                            value: thing.year
                        },
                        {
                            name: `Wikipedia link${thing.links.length != 1 ? 's' : ''}`,
                            value: thing.links.map(l => `[${l.title}](${bot.utils.cleanUrl(l.link)})`).join(', ')
                        }
                    ]
                }
            ])
        }).catch(msg.error);
    });
};

exports.info = {
    name: 'today',
    usage: 'today <events|births|deaths>',
    description: 'Gives a random thing that happened today in history from http://history.muffinlabs.com/date'
};
