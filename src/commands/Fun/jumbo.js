exports.run = (bot, msg, args) => {
    if (args.length < 1)
        throw 'You must enter at least one emoji!';

    const emojis = args.map(a => bot.emojis.find(e => e == a)).filter(a => a);

    if (emojis.length < 1)
        throw 'Could not parse the emojis!';

    const sendJumbo = i => {
        if (!emojis[i])
            return;

        msg.channel.send({ files: [
            {
                attachment: emojis[i].url,
                name: `${emojis[i].name}.png`
            }
        ]}).then(() => {
            if (i < 1)
                msg.delete();

            sendJumbo(i + 1);
        }).catch(msg.error);
    };

    sendJumbo(0);
};

exports.info = {
    name: 'jumbo',
    usage: 'jumbo <emojis>',
    description: 'Sends the emojis as image attachments',
    aliases: ['j', 'large']
};
