const normalizeUrl = require('normalize-url');

exports.run = (bot, msg, args) => {
    if (args.length < 1) {
        bot.user.setGame(null, null);
        return msg.edit('Cleared your game! 👌').then(m => m.delete(3000));
    }

    if (msg.guild)
        bot.utils.assertEmbedPermission(msg.channel, msg.member);

    const parsed = bot.utils.parseArgs(args, ['s:']);

    const game = parsed.leftover.join(' ');
    let stream = parsed.options.s;

    const fields = [{ name: '🎮}\u2000Game', value: game }];

    if (stream) {
        stream = normalizeUrl(`twitch.tv/${stream}`);

        fields.push({ name: '🎧\u2000Stream URL', value: stream });
    }

    bot.user.setGame(game, stream);

    msg.edit('', { embed:
        bot.utils.embed('👌\u2000Game changed!', '', fields)
    }).then(m => m.delete(5000));
};

exports.info = {
    name: 'setgame',
    usage: 'setgame <game>',
    description: 'Sets your game (shows for other people)',
    options: [
        {
            name: '-s',
            usage: '-s <url>',
            description: 'Sets your streaming URL to http://twitch.tv/<url>'
        }
    ]
};
