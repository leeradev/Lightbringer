exports.run = (bot, msg, args) => {
    if (args.length < 1)
        throw 'You must provide a tag name!';

    const name = args[0];

    bot.db.get(`tags.${name}`).then(tag => {
        if (!tag)
            return msg.error(`The tag '${name}' does not exist.`);

        msg.edit(`${args.slice(1).join(' ')} ${tag.contents}`);

        tag.used++;
        bot.db.put(`tags.${name}`, tag).catch(bot.logger.severe);
    });
};

exports.info = {
    name: 'tag',
    usage: 'tag <name> [prefix]',
    description: 'Displays a saved tag (optionally append to prefix)',
    aliases: ['t']
};
