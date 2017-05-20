const snekfetch = require('snekfetch');

exports.run = (bot, msg, args) => {
    if (msg.guild)
        bot.utils.assertEmbedPermission(msg.channel, msg.member);

    if (args.length < 1)
        throw bot.consts.phrase('empty_search');

    const prev = msg.content;

    if (args[0].indexOf('/') !== -1) {
        const repo = safeRepo(args[0]);

        msg.edit(`🔄\u2000Loading info for '${repo}'\u2026`);

        snekfetch.get(`https://api.github.com/repos/${repo}`).then(res => {
            if (res.body.message === 'Not Found')
                return msg.error('That repository could not be found!');

            msg.edit(prev, { embed: buildEmbedFromJson(bot, res.body) });
        }).catch(msg.error);
    } else {
        msg.edit(bot.consts.phrase('searching_x', { x: args.join(' ') }));

        snekfetch.get(`https://api.github.com/search/repositories?q=${args.join('+')}`).then(res => {
            if (res.body.total_count < 1) return msg.error(`😢\u2000No results found for '${args.join(' ')}'`);

            const count = Math.min(3, res.body.total_count);

            console.log(require('util').inspect(res.body.items[1], { depth: 0 }));

            msg.channel.send(`✅\u2000Top ${count} results:`).then(() => msg.edit(prev)).then(() => {
                const sendResult = (i) => {
                    if (!res.body.items[i])
                        return;

                    msg.channel.send({ embed: buildEmbedFromJson(bot, res.body.items[i]) }).then(() => sendResult(i + 1));
                };

                sendResult(0);
            });
        }).catch(msg.error);
    }
};

const safeRepo = (input) => {
    if (input.indexOf('/') === -1) return;

    const user = input.substr(0, input.indexOf('/'));
    input = input.substr(input.indexOf('/') + 1);
    const repo = input.indexOf('/') === -1 ? input : input.substr(0, input.indexOf('/'));
    return `${user}/${repo}`;
};

const buildEmbedFromJson = (bot, json) => {
    return bot.utils.formatEmbed(json.full_name, json.description || 'No description provided.',
        [
            {
                title: 'Information',
                fields: [
                    {
                        name: 'Owner',
                        value: `[${json.owner.login}](${json.owner.html_url})`
                    },
                    {
                        name: 'Primary language',
                        value: json.language
                    }
                ]
            },
            {
                title: 'Links',
                fields: [
                    {
                        name: '',
                        value: `[Home page](${json.html_url})`
                    },
                    {
                        name: '',
                        value: `[Downloads](${json.html_url}/releases)`
                    },
                    {
                        name: '',
                        value: `[Issues](${json.html_url}/issues)`
                    }
                ],
                inline: true
            },
            {
                title: 'Statistics',
                fields: [
                    {
                        name: 'Open issues',
                        value: json.open_issues_count
                    },
                    {
                        name: 'Stars',
                        value: json.stargazers_count
                    },
                    {
                        name: 'Watchers',
                        value: json.subscribers_count || json.watchers_count
                    }
                ],
                inline: true
            },
            {
                title: 'Clone',
                fields: [
                    {
                        value: `\`git clone ${json.clone_url}\``
                    }
                ]
            }
        ],
        {
            footer: 'GitHub',
            footerIcon: 'https://a.safe.moe/cxwFp.png',
            color: '#4078c0'
        }
    );
};

exports.info = {
    name: 'github',
    usage: 'github <user/repo>',
    description: 'Links to a GitHub repository',
    aliases: ['git']
};
