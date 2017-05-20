exports.run = (bot, msg, args) => {
    if (args.length < 1)
        throw 'You must enter an emoji!';

    const emoji = bot.emojis.find(e => e == args[0]);

    if (!emoji)
        throw 'That emoji was not found!';

    return msg.edit(`${emoji} is from ${emoji.guild.name}.`);
};

exports.info = {
    name: 'locate',
    usage: 'locate <emoji>',
    description: 'Gets the name of the guild that the emoji comes from',
    aliases: ['emoji']
};
