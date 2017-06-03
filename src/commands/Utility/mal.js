const popura = require('popura');
const paginate = require('paginate-array');
const Entities = require('html-entities').XmlEntities;
const bbCodeToMarkdown = require('bbcode-to-markdown');
const moment = require('moment');

const resultsPerPage = 10;

exports.run = (bot, msg, args) => {
    if (!bot.config.malUser || !bot.config.malPassword)
        throw 'MyAnimeList username or password is missing from config.json file.';

    if (msg.guild)
        bot.utils.assertEmbedPermission(msg.channel, msg.member);

    const parsed = bot.utils.parseArgs(args, ['m', 'l', 'p:', 'i:']);

    if (parsed.leftover.length < 1)
        throw bot.consts.phrase('empty_search');

    const query = parsed.leftover.join(' ');

    msg.edit(bot.consts.phrase('searching_x_on_y', { x: query, y: 'MyAnimeList' })).then(() => {
        const mal = popura(bot.config.malUser, bot.config.malPassword);

        mal.verifyAuth().then(auth => {
            if (auth.username !== bot.config.malUser)
                return msg.error('MyAnimeList auth did not return the expected value.');

            (parsed.options.m ? mal.searchMangas(query) : mal.searchAnimes(query)).then(res => {
                if (!res || !res[0])
                    return msg.error(bot.consts.phrase('no_matches'));

                new Promise((resolve, reject) => {
                    const isInRange = i => i > 0 && i <= res.length;
                    const invalidIndex = i => `\`${i}\` is not a valid index for this query. Valid index: \`1\` to \`${res.length}\`.`;
                    const isCancel = c => c.trim().toLowerCase() == 'cancel';

                    if (parsed.options.l) {
                        resolve(-1);
                    } else if (parsed.options.i) {
                        if (isInRange(parsed.options.i))
                            resolve(parsed.options.i);
                        else
                            reject(invalidIndex(parsed.options.i));
                    } else if (res.length > 1) {
                        const awaitTimeout = 30;

                        msg.edit(
                            `Found \`${res.length}\` matches for \`${query}\`:\n` +
                            buildList(bot, res, 'Matches', parsed.options.p) + '\n' +
                            `Please specify an index within ${awaitTimeout} second${awaitTimeout != 1 ? 's' : ''} or say \`cancel\` to cancel.`
                        ).then(() => {
                            msg.channel.awaitMessages(m => {
                                if (m.author != msg.author)
                                    return false;

                                if (isInRange(parseInt(m.content)) || isCancel(m.content))
                                    return true;
                                else
                                    m.edit(`❌\u2000${invalidIndex(m.content)}`).then(m => m.delete(3000));
                            }, {
                                max: 1,
                                time: awaitTimeout * 1000,
                                errors: ['time']
                            }).then(collected => {
                                const m = collected.first();

                                m.delete().then(() => {
                                    if (isCancel(m.content))
                                        reject('The command was cancelled.');
                                    else
                                        resolve(parseInt(m.content) - 1);
                                });
                            }).catch(() =>
                                reject(`You did not specify an index within ${awaitTimeout != 1 ? 's' : ''} second${awaitTimeout != 1 ? 's' : ''}.`)
                            );
                        }).catch(reject);
                    } else {
                        resolve(0);
                    }
                }).then(i => {
                    if (i < 0) {
                        msg.edit(
                            bot.consts.phrase('self_destruct_in_t', { t: '30 seconds' }) + '\n' +
                            buildList(bot, res, 'Search Results', parsed.options.p)
                        ).then(() => msg.delete(30000)).catch(msg.error);
                    } else {
                        const item = res[i];

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

                        msg.edit(`Search result of \`${query}\` at index \`${i + 1}\` on MyAnimeList:`, { embed }).catch(msg.error);
                    }
                }).catch(msg.error);
            });
        });
    });
};

const buildList = (bot, res, title, p) => {
    const page = p || 1;
    const pagRes = paginate(res, page, resultsPerPage);

    let list = `[${title}] [Page: ${pagRes.currentPage}/${pagRes.totaPages}]\n\n`;

    for (let i = 0; i < pagRes.data.length; i++) {
        list += `${bot.utils.pad('  ', ((pagRes.currentPage - 1) * pagRes.perPage) + i + 1, true)} : ${pagRes.data[i].title}`;
        if (i < pagRes.data.length - 1)
            list += '\n';
    }

    if (pagRes.currentPage < pagRes.totaPages)
        list += `\n   : and ${pagRes.total - (pagRes.currentPage * pagRes.perPage)} more`;

    return bot.utils.toCode(list, 'js');
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
            description: 'Sets the index of which info to show (not to be used with either -l or -p)'
        }
    ]
};
