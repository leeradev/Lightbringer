exports.run = (bot, msg, args) => {
    if (args.length) {
        if (/l(ist)?/i.test(args[0])) {
            return bot.db.entries().then(entries => {
                const mentions = entries.filter(e => e.key.startsWith('mentions.')).map(e => e.value);

                if (mentions.length < 1)
                    return msg.error('You are not logging mentions from any guilds!');

                msg.edit(msg.content, { embed:
                    bot.utils.embed('Logging mentions from these guilds:',
                        `${bot.consts.phrase('self_destruct_in_t', { t: '30 seconds' })}\n\n` +
                        mentions.map(m => {
                            const guild = bot.guilds ? bot.guilds.get(m.id) : false;
                            return `- ${guild ? `**${guild.name}:** ` : ''}\`${m.id}\``;
                        }).join('\n')
                    )
                }).then(m => m.delete(60000));
            });
        } else {
            throw bot.consts.phrase('invalid_action');
        }
    }

    if (!msg.guild)
        throw 'This command is only available in guilds!';

    if (!msg.guild.available)
        throw 'Guild info is not yet available';

    const id = msg.guild.id;

    bot.db.get(`mentions.${id}`).then(m => {
        if (m)
            return bot.db.delete(`mentions.${id}`).then(() => {
                msg.edit('👍\u2000I will stop logging mentions from this guild!').then(m => m.delete(10000));
            });

        bot.db.put(`mentions.${id}`, { id }).then(() => {
            msg.edit('👌\u2000I will log mentions from this guild!').then(m => m.delete(10000));
        });
    });
};

exports.info = {
    name: 'tmention',
    usage: 'tmention [list]',
    description: 'Toggle mentions logger in this guild',
    aliases: ['togglemention']
};
