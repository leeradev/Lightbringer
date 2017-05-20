const { exec } = require('child_process');
const username = require('os').userInfo().username;

exports.run = (bot, msg, args) => {
    if (args.length < 1)
        throw 'You must provide a command to run!';

    const parsed = bot.utils.parseArgs(args, 'l:');

    const ps = exec(parsed.leftover.join(' '));
    if (!ps)
        throw 'Failed to start process!';

    const opts = {
        prefix: `\`\`\`${parsed.options.l || 'bash'}\n`,
        suffix: '\n```',
        delay: 10,
        cutOn: '\n'
    };

    ps.stdout.on('data', data => bot.utils.sendLarge(msg.channel, clean(data, bot.parentDirectory), opts));
    ps.stderr.on('data', data => bot.utils.sendLarge(msg.channel, clean(data, bot.parentDirectory), opts));
};

const clean = (data, parent) => {
    return data.toString()
        .replace(new RegExp(parent, 'g'), '<Parent>')
        .replace(new RegExp(username, 'g'), '<Username>')
        .replace(/\[[0-9]*m/g, '');
};

exports.info = {
    name: 'exec',
    usage: 'exec [-l <lang>] <command>',
    description: 'Executes a command in the console'
};
