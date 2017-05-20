const truncate = require('truncate');

exports.run = (bot, msg, args) => {
    if (msg.guild)
        bot.utils.assertEmbedPermission(msg.channel, msg.member);

    bot.utils.getMsg(bot.channels.get(args[1]) || msg.channel, args[0]).then(m => {
        const nestedFields = [];
        for (let i = 0; i < m.edits.length; i++) {
            nestedFields.push({
                title: `${i == m.edits.length - 1 ? 'Original' : (i == 0 ? 'Latest' : `Edit #${m.edits.length - i - 1}`)}`,
                fields: [
                    {
                        value: truncate(m.edits[i].content, 1023)
                    }
                ]
            });
        }

        msg.edit(msg.content, { embed:
            bot.utils.formatEmbed('', '', nestedFields, {
                footer: `Edit history | ID: ${m.id}`
            })
        });
    }).catch(msg.error);
};

exports.info = {
    name: 'edits',
    usage: 'edits [id] [channel]',
    description: 'Gets all the recent edits of a particular message (depends on the bot\'s cache - may optionally set a channel)'
};
