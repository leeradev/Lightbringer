const truncate = require('truncate');

exports.run = (bot, msg, args) => {
    const parsed = bot.utils.parseArgs(args, ['v']);

    if (parsed.leftover.length < 1) {
        if (msg.guild)
            bot.utils.assertEmbedPermission(msg.channel, msg.member);

        return bot.db.entries().then(entries => {
            const tags = entries.filter(e => e.key.startsWith('tags.')).map(e => e.value).sort((a, b) => b.used - a.used);

            if (tags.length < 1)
                return msg.error('You have no tags!');

            msg.edit(msg.content, { embed:
                bot.utils.formatLargeEmbed(`Tags [${tags.length}]`, bot.consts.phrase('self_destruct_in_t', { t: '60 seconds' }), {
                    delimeter: '\n',
                    children: tags.map(tag => {
                        if (parsed.options.v) {
                            const prefix = `**${tag.name}** [${tag.used}]: \``;
                            return prefix + truncate(bot.utils.cleanCustomEmojis(tag.contents), 1024 - prefix.length - 2) + '`';
                        } else {
                            return `•\u2000${tag.name} [${tag.used}]`;
                        }
                    })
                })
            }).then(m => m.delete(60000));
        });
    }

    if (/a(dd)?|c(reate)?/i.test(parsed.leftover[0])) {
        if (parsed.leftover.length < 3)
            throw `Usage: \`${bot.config.prefix}tags add <name> <contents>\``;

        const name = parsed.leftover[1];
        const contents = parsed.leftover.slice(2).join(' ');

        bot.db.get(`tags.${name}`).then(tag => {
            if (tag)
                return msg.error('That tag already exists!');

            bot.db.put(`tags.${name}`, { name, contents, used: 0 }).then(() =>
                msg.success(`Created tag \`${name}\`!`)
            );
        });
    } else if (/d(el(ete)?)?|r(em(ove)?)?/i.test(parsed.leftover[0])) {
        if (parsed.leftover.length < 2)
            throw `Usage: \`${bot.config.prefix}tags delete <name>\``;

        const name = parsed.leftover[1].toLowerCase();
        bot.db.delete(`tags.${name}`).then(() => {
            msg.success(`Removed the tag \`${name}\`!`);
        });
    } else {
        throw bot.consts.phrase('invalid_action');
    }
};

exports.info = {
    name: 'tags',
    usage: 'tags [-v] [add|delete] [name] [contents]',
    description: 'Controls or lists your shortcuts',
    options: [
        {
            name: '-v',
            usage: '-v',
            description: 'Verbose (shows the tags content when listing them)'
        }
    ]
};
