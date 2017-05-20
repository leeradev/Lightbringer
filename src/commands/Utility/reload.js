exports.run = (bot, msg, args) => {
    if (args.length < 1)
        throw 'You must specify a module name to reload!';

    if (bot.commands.loadCommand(args.join(' '), bot.commandsDirectory, true))
        msg.success('Module successfully reloaded!');
    else
        msg.error('An unexpected error occurred while trying to reload the module!');
};

exports.info = {
    name: 'reload',
    usage: 'reload <module>',
    description: 'Reloads a module',
    aliases: ['r']
};
