exports.run = (bot, msg, args) => {
    if (args.length < 1) {
        throw 'You must have something to upload!';
    }

    const parsed = bot.utils.parseArgs(args, ['r', 's:']);

    msg.edit('🔄\u2000Uploading...').then(() =>
        bot.utils.haste(parsed.leftover.join(' '), '', true).then(r => msg.success(r, -1)).catch(msg.error)
    );
};

exports.info = {
    name: 'haste',
    usage: 'haste [options] <text>',
    description: 'Uploads some text to Hastebin',
    aliases: ['hastebin'],
    options: [
        {
            name: '-r',
            usage: '-r',
            description: 'Returns the raw version instead'
        },
        {
            name: '-s',
            usage: '-s <suffix>',
            description: 'Suffix for the hastebin link (to set a specific syntax highlighter)'
        }
    ]
};
