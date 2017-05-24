const popura = require('popura');
const paginate = require('paginate-array');
const Entities = require('html-entities').XmlEntities;
const bbCodeToMarkdown = require('bbcode-to-markdown');
const moment = require('moment');

const resultsPerPage = 10;

exports.run = (bot, msg, args) => {
    if (!bot.config.malUser || !bot.config.malPassword)
        throw 'MyAnimeList username or password is missing from config.json';

    if (msg.guild)
        bot.utils.assertEmbedPermission(msg.channel, msg.member);

    const prev = msg.content;
    const parsed = bot.utils.parseArgs(args, ['m', 'l', 'p:', 'i:']);
    const query = parsed.leftover.join(' ');

    if (query.length < 1)
        throw bot.consts.phrase('empty_search');

    msg.edit(bot.consts.phrase('searching_x_on_y', { x: query, y: 'MyAnimeList' })).then(() => {
        const mal = popura(bot.config.malUser, bot.config.malPassword);

        mal.verifyAuth().then(auth => {
            if (auth.username !== bot.config.malUser)
                return msg.error('MyAnimeList auth did not return the expected value');

            (parsed.options.m ? mal.searchMangas(query) : mal.searchAnimes(query)).then(res => {
                if (!res || !res[0])
                    return msg.error(bot.consts.phrase('no_matches'));

                if (parsed.options.l) {
                    const page = parseInt(parsed.options.p) ? parseInt(parsed.options.p) : 1;
                    const pagRes = paginate(res, page, resultsPerPage);

                    let list = `[Search Results] [Page: ${pagRes.currentPage}/${pagRes.totaPages}]\n\n`;

                    for (let i = 0; i < pagRes.data.length; i++) {
                        list += `${bot.utils.pad('  ', ((pagRes.currentPage - 1) * pagRes.perPage) + i + 1, true)} : ${pagRes.data[i].title}`;
                        if (i < pagRes.data.length - 1)
                            list += '\n';
                    }

                    if (pagRes.currentPage < pagRes.totaPages)
                        list += `\n   : and ${pagRes.total - (pagRes.currentPage * pagRes.perPage)} more`;

                    msg.edit(`${bot.consts.phrase('self_destruct_in_t', { t: '30 seconds' })}\n\`\`\`js\n${list}\`\`\``).catch(msg.error).then(() => { msg.delete(30000); });
                } else {
                    const index = parseInt(parsed.options.i) ? parseInt(parsed.options.i) : 1;
                    const item = res[index - 1];

                    if (!item)
                        return msg.error(bot.consts.phrase('no_matches'));

                    const embed = bot.utils.formatEmbed('',
                        `${item.english ? `**Alternative Title:** ${item.english}\n\n` : ''}${bbCodeToMarkdown(new Entities().decode(item.synopsis.replace(/\r\n/g, '')))}`,
                        [
                            {
                                title: 'Information',
                                fields: [
                                    {
                                        name: 'Score',
                                        value: `${item.score.toLocaleString()} / 10`
                                    },
                                    {
                                        name: parsed.options.m ? 'Volumes / Chapters' : 'Episodes',
                                        value: parsed.options.m ? `${item.volumes.toLocaleString()} / ${item.chapters.toLocaleString()}` : item.episodes.toLocaleString()
                                    },
                                    {
                                        name: 'Type',
                                        value: item.type
                                    },
                                    {
                                        name: 'Status',
                                        value: item.status
                                    }
                                ]
                            },
                            {
                                title: 'Link',
                                fields: [
                                    {
                                        value: `**https://myanimelist.net/${parsed.options.m ? 'manga' : 'anime'}/${item.id}/**`
                                    }
                                ]
                            }
                        ],
                        {
                            thumbnail: item.image,
                            footer: `MyAnimeList${item.start_date ? ` | ${moment(item.start_date).format(bot.consts.shortDateFormat)}${item.end_date ? ` to ${moment(item.end_date).format(bot.consts.shortDateFormat)}` : ''}` : ''}`,
                            footerIcon: 'https://a.safe.moe/3NOZ3.png',
                            color: '#1d439b'
                        }
                    );

                    embed.setAuthor(item.title, item.image);

                    msg.edit(prev, { embed: embed }).catch(msg.error);
                }
            });
        });
    });
};

exports.info = {
    name: 'mal',
    usage: 'mal [options] <query>',
    description: 'Search for anime info from MyAnimeList',
    aliases: ['anime', 'myanimelist'],
    options: [
        {
            name: '-m',
            usage: '-m',
            description: 'Search for manga info instead'
        },
        {
            name: '-l',
            usage: '-l',
            description: 'Display list of all results'
        },
        {
            name: '-p',
            usage: '-p <page>',
            description: 'Sets the page of list of all results to show (requires -l to be set)'
        },
        {
            name: '-i',
            usage: '-i <index>',
            description: 'Sets the index of which info to show (requires -l and -p to be unset)'
        }
    ]
};
