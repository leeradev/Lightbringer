const ostb = require('os-toolbox');
const getos = require('getos');
const uwsPackage = require('../../../node_modules/uws/package.json');

exports.run = (bot, msg) => {
    if (msg.guild)
        bot.utils.assertEmbedPermission(msg.channel, msg.member);

    const prev = msg.content;

    msg.edit('🔄\u2000Fetching CPU load and memory usage\u2026').then(() => {
        getos((err, res) => {
            if (err)
                return msg.error(err);

            ostb.cpuLoad().then(cpuLoad => {
                ostb.memoryUsage().then(memoryUsage => {
                    msg.edit(prev, { embed:
                        bot.utils.formatEmbed(
                            'Lightbringer Stats',
                            bot.consts.phrase('self_destruct_in_t', { t: '60 seconds' }),
                            [
                                {
                                    title: 'System',
                                    fields: [
                                        {
                                            name: 'OS',
                                            value: `${res.os == 'linux' ? `${res.dist} ${res.release}` : res.os}`
                                        },
                                        {
                                            name: 'CPU load',
                                            value: `${cpuLoad}%`
                                        },
                                        {
                                            name: 'Memory usage',
                                            value: `${memoryUsage}%`
                                        },
                                        {
                                            name: 'Heap',
                                            value: `${(process.memoryUsage().heapUsed / 1024 / 1024).toFixed(2)} MB`
                                        },
                                        {
                                            name: 'Heartbeat',
                                            value: `${bot.ping.toFixed(0)}ms`
                                        },
                                        {
                                            name: 'Uptime',
                                            value: bot.utils.humanizeDuration(bot.uptime, true)
                                        }
                                    ]
                                },
                                {
                                    title: 'Stats',
                                    fields: [
                                        {
                                            name: 'Sent',
                                            value: bot.managers.stats.get('messages-sent').toLocaleString()
                                        },
                                        {
                                            name: 'Received',
                                            value: bot.managers.stats.get('messages-received').toLocaleString()
                                        },
                                        {
                                            name: 'Mentions',
                                            value: bot.managers.stats.get('mentions').toLocaleString()
                                        },
                                        {
                                            name: 'Guilds',
                                            value: bot.guilds.size.toLocaleString()
                                        },
                                        {
                                            name: 'Channels',
                                            value: bot.channels.size.toLocaleString()
                                        },
                                        {
                                            name: 'Users',
                                            value: bot.users.size.toLocaleString()
                                        }
                                    ]
                                },
                                {
                                    title: 'Others',
                                    fields: [
                                        {
                                            name: 'Node.js',
                                            value: `[${process.versions.node}](${process.release.sourceUrl})`
                                        },
                                        {
                                            name: 'Lightbringer',
                                            value: `[${process.env.npm_package_version}](https://github.com/BobbyWibowo/Lightbringer)`
                                        },
                                        {
                                            name: 'discord.js',
                                            value: `[${require('discord.js').version}](https://github.com/hydrabolt/discord.js)`
                                        },
                                        {
                                            name: 'uws',
                                            value: `[${uwsPackage.version}](https://github.com/uWebSockets/uWebSockets)`
                                        }
                                    ]
                                }
                            ],
                            { inline: true }
                        )
                    }).then(m => m.delete(60000)).catch(msg.error);
                }, msg.error);
            });
        });
    });
};

exports.info = {
    name: 'stats',
    usage: 'stats',
    description: 'Shows you stats about Lightbringer'
};
