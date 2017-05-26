exports.run = (bot, msg) => {
    const reload = bot.commands.loadCommands(bot.commandsDirectory, '-a');

    if (!isNaN(parseInt(reload)))
        msg.success(`${reload} module${reload != 1 ? 's were' : ' was'} successfully reloaded!`);
    else
        msg.error('An unexpected error occurred while trying to reload the module!');
};

exports.info = {
    name: 'reload',
    usage: 'reload',
    description: 'Reloads all modules',
    aliases: ['r']
};
