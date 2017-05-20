const truncate = require('truncate');

exports.run = (bot, msg, args) => {
    if (args.length < 1) {
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
                        const prefix = `**${tag.name}** [${tag.used}]: \``;
                        return prefix + truncate(tag.contents, 1024 - prefix.length - 2) + '`';
                    })
                })
            }).then(m => m.delete(60000));
        });
    }

    if (/a(dd)?|c(reate)?/i.test(args[0])) {
        if (args.length < 3)
            throw `Usage: \`${bot.config.prefix}tags add <name> <contents>\``;

        const name = args[1];
        const contents = args.slice(2).join(' ');

        bot.db.get(`tags.${name}`).then(tag => {
            if (tag)
                return msg.error('That tag already exists!');

            bot.db.put(`tags.${name}`, { name, contents, used: 0 }).then(() =>
                msg.success(`Created tag \`${name}\`!`)
            );
        });
    } else if (/d(el(ete)?)?|r(em(ove)?)?/i.test(args[0])) {
        if (args.length < 2)
            throw `Usage: \`${bot.config.prefix}tags delete <name>\``;

        const name = args[1].toLowerCase();
        bot.db.delete(`tags.${name}`).then(() => {
            msg.success(`Removed the tag \`${name}\`!`);
        });
    } else {
        throw bot.consts.phrase('invalid_action');
    }
};

exports.info = {
    name: 'tags',
    usage: 'tags [add|delete] [name] [contents]',
    description: 'Controls or lists your shortcuts'
};
