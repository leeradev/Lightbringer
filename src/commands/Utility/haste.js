const snekfetch = require('snekfetch');
const url = require('url');

exports.run = (bot, msg, args) => {
    if (args.length < 1) {
        throw 'You must have something to upload!';
    }

    const parsed = bot.utils.parseArgs(args, 'r');

    msg.edit('🔄\u2000Uploading...').then(() => {
        snekfetch.post(url.resolve('https://hastebin.com', 'documents')).send({
            body: parsed.leftover.join(' ')
        }).then(res => {
            if (!res.body || !res.body.key) {
                msg.error('Failed to upload, no key was returned!');
                return;
            }
            const key = res.body.key || res.body;
            if (parsed.options.r) {
                msg.success(`https://hastebin.com/raw/${key}`);
            } else {
                msg.success(`https://hastebin.com/${key}`);
            }
        }).catch(err => {
            msg.error(`Failed to upload: ${err}`, 5000);
        });
    });
};

exports.info = {
    name: 'haste',
    usage: 'haste [-r] <text>',
    description: 'Uploads some text to Hastebin',
    aliases: ['hastebin']
};
