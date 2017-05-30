'use strict';

const path = require('path');
const fse = require('fs-extra');
const Discord = require('discord.js');
const XPDB = require('xpdb');
const readline = require('readline');
const didYouMean = require('didyoumean2');
const stripIndents = require('common-tags').stripIndents;

const Managers = require('./managers');

const bot = exports.client = new Discord.Client();
Managers.Migrator.migrate(bot, __dirname);

bot.managers = {};

const configManager = bot.managers.config = new Managers.Config(bot, __dirname);
const config = bot.config = configManager.load();

bot.managers.notifications = new Managers.Notifications();

const logger = bot.logger = new Managers.Logger(bot);
const commands = bot.commands = new Managers.CommandManager(bot);
const stats = bot.managers.stats = new Managers.Stats(bot);

logger.inject();

const dataFolder = path.join(__dirname, '../data/');
if (!fse.existsSync(dataFolder)) fse.mkdirSync(dataFolder);

const configsFolder = path.join(dataFolder, 'configs');
if (!fse.existsSync(configsFolder)) fse.mkdirSync(configsFolder);

const db = bot.db = new XPDB(path.join(dataFolder, 'db'));

let loaded = false;

bot.on('ready', () => {
    bot.parentDirectory = path.join(__dirname, '../..');
    bot.srcDirectory = __dirname;

    bot.utils = require('./utils');
    bot.consts = require('./consts.js');

    bot.commandsDirectory = path.join(__dirname, 'commands');
    commands.loadCommands(bot.commandsDirectory);

    (title => {
        process.title = title;
        process.stdout.write(`\u001B]0;${title}\u0007`);
    })(`Lightbringer - ${bot.user.username}`);

    logger.info(stripIndents`
        Stats:
        - User: ${bot.user.tag} <ID: ${bot.user.id}>
        - Channels: ${bot.channels.size}
        - Guilds: ${bot.guilds.size}
    `);

    stats.set('messages-sent', 0);
    stats.set('messages-received', 0);
    stats.set('mentions', 0);

    if (config.extended)
        bot.extended = require('./extended.js');

    delete bot.user.email;
    delete bot.user.verified;

    logger.info('Bot is ready!');

    readline.createInterface({
        input: process.stdin,
        output: process.stdout,
        prompt: ''
    }).on('line', line => {
        try {
            console.log(eval(line) || 'undefined');
        } catch (err) {
            console.error(err);
        }
    }).on('SIGINT', () => {
        process.exit(1);
    });

    loaded = true;

    if (config.statusChannel)
        bot.channels.get(config.statusChannel).send('✅\u2000Bot is ready!');
});

const assertMentionLog = (_, msg) => {
    if (msg.isMemberMentioned(bot.user)) {
        // NOTE: Send to mentions log channel if necessary
        if (config.mentionLogChannel) {
            new Promise(resolve => {
                if (msg.guild && msg.guild.id) {
                    const id = msg.guild.id;

                    bot.db.get(`mentions.${id}`).then(m => {
                        resolve(m ? true : false);
                    });
                } else {
                    resolve(true); // DMs (?)
                }
            }).then(log => {
                if (log) {
                    bot.commands.execute(undefined, bot.commands.get('q'), ['-c'], {
                        msg,
                        channel: msg.channel,
                        target: bot.channels.get(config.mentionLogChannel)
                    });
                    stats.increment('mentions');
                }
            });
        } else {
            stats.increment('mentions');
        }
    }
};

bot.on('message', msg => {
    stats.increment(`messages-${bot.user.id === msg.author.id ? 'sent' : 'received'}`);

    assertMentionLog(null, msg);

    // NOTE: Ignore if wasn't sent by bot's owner
    if (msg.author.id !== bot.user.id)
        return;

    // NOTE: Ignore blacklisted servers
    if (msg.guild && config.blacklistedServers && config.blacklistedServers.indexOf(msg.guild.id.toString()) > -1)
        return;

    // NOTE: Return if message didn't start with prefix
    if (!msg.content.toLowerCase().startsWith(config.prefix.toLowerCase()))
        return;

    const split = msg.content.substr(config.prefix.length).trim().split(' ');
    let base = split[0].toLowerCase();
    let args = split.slice(1);

    let command = commands.get(base);

    if (command)
        return commands.execute(msg, command, args);

    db.get(`shortcuts.${base}`).then(sc => {
        if (sc) {
            base = sc.command.split(' ')[0].toLowerCase();
            args = sc.command.split(' ').splice(1).concat(args);

            command = commands.get(base);

            if (command)
                commands.execute(msg, command, args);
            else
                return msg.edit(`⛔\u2000The shortcut \`${sc.name}\` is improperly set up!`).then(m => m.delete(2000));

            return;
        }

        const maybe = didYouMean(base, commands.all().map(c => c.info.name), {
            threshold: 5,
            thresholdType: 'edit-distance'
        });

        if (maybe)
            msg.edit(`❓\u2000Did you mean \`${config.prefix}${maybe}\`?`).then(m => m.delete(5000));
        else
            msg.edit(`⛔\u2000No commands were found that were similar to \`${config.prefix}${base}\``).then(m => m.delete(5000));
    });
});

bot.on('messageUpdate', assertMentionLog);

// NOTE: Cache members of newly joined guilds
bot.on('guildCreate', guild => guild.fetchMembers());

process.on('exit', () => {
    bot.db.unwrap().close();
    loaded && bot.destroy();
});

bot.on('error', console.error);
bot.on('warn', console.warn);
bot.on('disconnect', event => {
    if (event.code === 1000)
        logger.info('Disconnected from Discord cleanly');
    else
        logger.warn(`Disconnected from Discord with code ${event.code}`);

    process.exit(42); // Restart bot on disconnect
});

process.on('uncaughtException', err => logger.severe(err.stack));
process.on('unhandledRejection', err => logger.severe('Uncaught Promise error: \n' + err.stack));

config && bot.login(config.botToken);
