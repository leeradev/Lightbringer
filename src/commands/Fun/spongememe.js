/**
 * NOTE: This command is cancerous!
 */

exports.run = (bot, msg, args) => {
    const emoji = bot.emojis.get('313010878196875265');

    if (!emoji)
        throw 'You do not have the \'spongeMyCock\' emoji!';

    const parsed = bot.utils.parseArgs(args, ['t:']);
    const channel = bot.channels.get(parsed.leftover[1]) || msg.channel;

    new Promise(resolve => {
        if (parsed.options.t)
            resolve(parsed.options.t);
        else
            bot.utils.getMsg(channel, parsed.leftover[0], msg.id).then(m =>
                resolve(m.content)
            ).catch(msg.error);
    }).then(text =>
        msg.edit(`${text.split('').map(a => Math.round(Math.random()) ? a.toUpperCase() : a.toLowerCase()).join('')} ${emoji}`)
    );
};

exports.info = {
    name: 'spongememe',
    usage: 'spongememe [-t] [id] [channel]',
    description: 'Turns a specific message into a SpongeBob meme (this command is cancerous!)',
    aliases: ['sm'],
    options: [
        {
            name: '-t',
            usage: '-t <text>',
            description: 'Specify a text instead'
        }
    ]
};
