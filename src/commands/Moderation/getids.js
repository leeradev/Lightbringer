exports.run = (bot, msg, args) => {
    const channel = bot.channels.get(args[1]) || msg.channel;
    let amount = 5;

    if (args[0]) {
        if (isNaN(parseInt(args[0])))
            throw 'Invalid amount. It must be numbers!';
        else
            amount = Math.min(50, parseInt(args[0]));
    }

    channel.fetchMessages({
        limit: amount - 1,
        before: msg.id
    }).then(msgs => {
        msgs = msgs.array();
        msgs.unshift(msg);
        msgs.length = Math.min(amount, msgs.length);

        let i = 0;
        const content = msgs.map(m => `${bot.utils.pad('  ', ++i)} : ${m.id}`);

        msg.edit(`IDs of the latest ${amount} messages (including this message - newest to oldest):\n\`\`\`\n${content.join('\n')}\n\`\`\``);
    }).catch(msg.error);
};

exports.info = {
    name: 'getids',
    usage: 'getids [amount] [channel]',
    description: 'Get a list of message IDs (by default will get the latest 5 messages from the current channel - max amount is 50)'
};
