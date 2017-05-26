const truncate = require('truncate');

exports.run = (bot, msg, args) => {
    if (args.length < 1) {
        if (msg.guild)
            bot.utils.assertEmbedPermission(msg.channel, msg.member);

        return bot.db.entries().then(entries => {
            const shortcuts = entries.filter(e => e.key.startsWith('shortcuts.')).map(e => e.value);

            if (shortcuts.length < 1)
                return msg.error('You have no shortcuts!');

            msg.edit(msg.content, { embed:
                bot.utils.formatLargeEmbed(`Shortcuts [${shortcuts.length}]`, bot.consts.phrase('self_destruct_in_t', { t: '60 seconds' }), {
                    delimeter: '\n',
                    children: shortcuts.map(sc => {
                        const prefix = `**${sc.name}:** \``;
                        return prefix + truncate(bot.utils.cleanCustomEmojis(sc.command), 1024 - prefix.length - 2) + '`';
                    })
                })
            }).then(m => m.delete(60000));
        });
    }

    if (/^a(dd)?$|^c(reate)?$/i.test(args[0])) {
        if (args.length < 3)
            throw `Usage: \`${bot.config.prefix}shortcut add <id> <command>\``;

        const id = args[1].toLowerCase();
        const command = args.slice(2).join(' ');

        if (bot.commands.get(id))
            throw 'That name was already reserved by a module as a command or an alias!';

        bot.db.get(`shortcuts.${id}`).then(sc => {
            if (sc)
                return msg.error(`The shortcut \`${id}\` already exists!`);

            bot.db.put(`shortcuts.${id}`, { name: id, command }).then(() =>
                msg.success(`Created shortcut \`${id}\`!`)
            );
        });
    } else if (/^d(el(ete)?)?$|^r(em(ove)?)?$/i.test(args[0])) {
        if (args.length < 2)
            throw `Usage: \`${bot.config.prefix}shortcut remove <id>\``;

        const id = args[1].toLowerCase();
        bot.db.delete(`shortcuts.${id}`).then(() =>
            msg.success(`Removed the shortcut \`${id}\`!`)
        );
    } else {
        throw bot.consts.phrase('invalid_action');
    }
};

exports.info = {
    name: 'shortcuts',
    usage: 'shortcuts [add|delete] [id] [commands]',
    description: 'Controls or lists your shortcuts',
    aliases: ['sc', 'shortcut']
};
