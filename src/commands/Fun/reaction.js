const normalEmojiRegex = require('emoji-regex')();
const customEmojiRegex = /<:\w+?:(\d+?)>/;

exports.run = (bot, msg, args) => {
    const parsed = bot.utils.parseArgs(args, ['m:', 'c:']);
    const reactions = parsed.leftover.join(' ');

    if (reactions.length < 1)
        throw 'No text provided to react with!';

    const channel = bot.channels.get(parsed.options.c) || msg.channel;

    bot.utils.getMsg(channel, parsed.options.m, msg.id).then(m => {
        let chars = [];
        let customEmojis = bot.user.premium ? bot.emojis : bot.emojis.filter(e => e.managed);

        if (msg.guild)
            customEmojis = customEmojis.concat(msg.guild.emojis);

        const regex = new RegExp(`${customEmojiRegex.source}|${normalEmojiRegex.source}|[a-zA-Z0-9#*!?]`, 'g');
        const matches = reactions.match(regex);

        if (!matches)
            throw 'Could not parse the text into reactions!';

        for (const reaction of matches) {
            if (chars.length >= 20)
                break;

            const customEmoji = reaction.match(customEmojiRegex);
            if (customEmoji) {
                const emoji = customEmojis.get(customEmoji[1]);
                if (emoji)
                    chars.push(emoji);
                continue;
            }

            const normalEmoji = reaction.match(normalEmojiRegex);
            if (normalEmoji) {
                chars.push(reaction);
                continue;
            }

            const emojiMap = bot.consts.emojiMap[reaction.toLowerCase()];
            if (emojiMap) {
                let x;
                switch(typeof emojiMap) {
                case 'object':
                    for (let i = 0; i < emojiMap.length; i++) {
                        if (!chars.includes(emojiMap[i])) {
                            x = emojiMap[i];
                            break;
                        }
                    }
                    break;
                case 'string':
                    x = emojiMap;
                    break;
                }

                if (x)
                    chars.push(x);
            }
        }

        chars = Array.from(new Set(chars));

        if (chars.length < 1)
            throw 'Could not build the reactions array!';

        chars.length = Math.min(chars.length, 20);

        const sendReact = i => {
            if (!chars[i])
                return;

            m.react(chars[i]).then(() => {
                if (i < 1)
                    msg.delete();

                sendReact(i + 1);
            }).catch(msg.error);
        };

        sendReact(0);
    }).catch(msg.error);
};

exports.info = {
    name: 'reaction',
    usage: 'reaction [options] <text|emoji|both>',
    description: 'Sends reaction to the previous message',
    aliases: ['react'],
    options: [
        {
            name: '-m',
            usage: '-m <id>',
            description: 'Specify an ID of a message to react to'
        },
        {
            name: '-c',
            usage: '-c <id>',
            description: 'Specify an ID of a channel which has the message (requires -m to be set)'
        }
    ]
};
