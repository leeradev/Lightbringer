exports.run = (bot, msg, args) => {
    if (args.length > 0) {
        const fileName = (/^u(tils)?$/i.test(args[0]) ? 'utils' : (/^c(onst(s)?)?$/i.test(args[0]) ? 'consts' : (/^e(xtend(ed)?)?$/i.test(args[0]) ? 'extended' : null)));

        if (!fileName)
            throw bot.consts.phrase('invalid_action');

        const filePath = `${bot.srcDirectory}/${fileName}.js`;

        try {
            delete require.cache[filePath];
            bot[fileName] = require(filePath);
            msg.success(`\`${fileName}.js\` was successfully reloaded!`);
        } catch (e) {
            throw e;
        }
    } else {
        const reload = bot.commands.loadCommands(bot.commandsDirectory, '-a');

        if (!isNaN(parseInt(reload)))
            msg.success(`${reload} module${reload != 1 ? 's were' : ' was'} successfully reloaded!`);
        else
            msg.error('An unexpected error occurred while trying to reload the module!');
    }
};

exports.info = {
    name: 'reload',
    usage: 'reload [utils|consts|extended]',
    description: 'Reloads all modules (or optionally reload \'utils\', \'consts\', \'extended\')',
    aliases: ['r']
};
