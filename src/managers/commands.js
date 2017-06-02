const path = require('path');
const chalk = require('chalk');
const read = require('readdir-recursive');
const Discord = require('discord.js');

class CommandManager {

    constructor(bot) {
        this.bot = bot;
        this._commands = [];
        this._categories = [];
    }

    _validateCommand(object) {
        if (typeof object !== 'object')
            return 'command setup is invalid';
        if (typeof object.run !== 'function')
            return 'run function is missing';
        if (typeof object.info !== 'object')
            return 'info object is missing';
        if (typeof object.info.name !== 'string')
            return 'info object is missing a valid name field';
        if (object.info.aliases && object.info.aliases.constructor.name !== 'Array')
            return 'info object has an invalid aliases field (it must be an array)';
        return null;
    }

    loadCommands(folder, manual = undefined) {
        let i = 0;
        if (manual === '-a') {
            for (const c of this._commands)
                if (c.info._filePath)
                    if (delete require.cache[c.info._filePath])
                        i++;
            this._commands = [];
            this._categories = [];
        } else if (manual !== undefined) {
            throw 'The bot can\'t reload individual command for the time being.';
        }

        read.fileSync(folder).forEach(file => this.loadCommand(file, folder));
        return i;
    }

    loadCommand(file, folder) {
        const bot = this.bot;

        file = file.substr(folder.length + 1);
        const basename = path.basename(file);

        if (basename.startsWith('_') || !basename.endsWith('.js')) return;

        const _filePath = `${folder}/${file}`;
        const command = require(_filePath);
        const error = this._validateCommand(command);
        if (error)
            return bot.logger.severe(`Failed to load '${file}': ${chalk.red(error)}`);

        if (!command.category) {
            const category = file.indexOf(path.sep) > -1 ? path.dirname(file) : 'Uncategorized';
            command.info.category = category;

            if (this._categories.indexOf(category) === -1)
                this._categories.push(category);
        }

        command.info._filePath = _filePath;

        this._commands.push(command);
    }

    all(category) {
        return !category ? this._commands : this._commands.filter(c => c.info.category.toLowerCase() === category.toLowerCase()).sort((a, b) => a.info.name.localeCompare(b.info.name));
    }

    categories() {
        return this._categories;
    }

    get(name) {
        return this.findBy('name', name) || this.findIn('aliases', name);
    }

    findBy(key, value) {
        return this._commands.find(c => c.info[key] === value);
    }

    findIn(key, value) {
        return this._commands.find(c => c.info[key] && c.info[key].includes(value));
    }

    execute(msg, command, args, ...extended) {
        if (msg instanceof Discord.Message) {
            msg.error = ((message, delay) => {
                this.bot.logger.severe(message.toString());
                msg.edit(`❌\u2000${message || 'Something failed!'}`)
                    .then(m => m.delete(delay || 8000));
            }).bind(msg);

            msg.success = ((message, delay) => {
                msg.edit(`✅\u2000${message || 'Success!'}`)
                    .then(m => {
                        if (delay !== -1)
                            m.delete(delay || 8000);
                    });
            }).bind(msg);
        }

        try {
            command.run(this.bot, msg, args, ...extended);
        } catch (e) {
            if (msg instanceof Discord.Message)
                msg.error(e);
            else
                console.error(e);
        }
    }

}

module.exports = CommandManager;
