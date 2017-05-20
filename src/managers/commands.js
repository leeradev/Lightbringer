const path = require('path');
const chalk = require('chalk');
const read = require('readdir-recursive');

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

    loadCommands(folder) {
        this._commands = [];
        this._categories = [];

        read.fileSync(folder).forEach(file => this.loadCommand(file, folder));
    }

    loadCommand(file, folder, manual = false) {
        const bot = this.bot;
        let old;
        let _path;

        if (manual) {
            old = this.get(file);
            if (!old)
                throw 'Module with that name could not be found!';

            _path = old.info._path;

            file = _path.substr(folder.length + 1);

            if (!this._commands.splice(this._commands.indexOf(old), 1) || !delete require.cache[_path])
                throw 'Could not remove the module from cache!';
        } else {
            file = file.substr(folder.length + 1);

            const basename = path.basename(file);
            if (basename.startsWith('_') || !basename.endsWith('.js'))
                return;

            _path = `${folder}/${file}`;
        }

        const command = require(_path);
        const error = this._validateCommand(command);
        if (error) {
            bot.logger.severe(`Failed to load '${file}': ${chalk.red(error)}`);
            return;
        }

        if (!command.category) {
            const category = file.indexOf(path.sep) > -1 ? path.dirname(file) : 'Uncategorized';
            command.info.category = category;

            if (this._categories.indexOf(category) === -1)
                this._categories.push(category);
        }

        command.info._path = _path;

        return this._commands.push(command);
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

    execute(msg, command, args) {
        msg.error = ((message, delay) => {
            this.bot.logger.severe(message.toString());
            msg.edit(`❌\u2000${message || 'Something failed!'}`)
                .then(m => m.delete(delay || 8000));
        }).bind(msg);

        msg.success = ((message, delay) => {
            msg.edit(`✅\u2000${message || 'Success!'}`)
                .then(m => m.delete(delay || 8000));
        }).bind(msg);

        try {
            command.run(this.bot, msg, args);
        } catch (e) {
            msg.error(e);
        }
    }

}

module.exports = CommandManager;
