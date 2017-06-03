const bot = require('./bot');
const Discord = require('discord.js');
const truncate = require('truncate');
const encodeUrl = require('encodeurl');
const moment = require('moment');
const snekfetch = require('snekfetch');
const stripIndents = require('common-tags').stripIndents;

exports.randomSelection = choices => {
    return choices[Math.floor(Math.random() * choices.length)];
};

exports.randomColor = () => {
    return [Math.floor(Math.random() * 256), Math.floor(Math.random() * 256), Math.floor(Math.random() * 256)];
};

exports.randomString = length => {
    const chars = '0123456789abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ';
    let result = '';

    for (let i = length; i > 0; --i)
        result += this.randomSelection(chars);

    return result;
};

exports.formatNumber = number => {
    if (isNaN(number)) return NaN;
    let input = `${number}`;
    if (number < 1e4) return input;
    const out = [];
    while (input.length > 3) {
        out.push(input.substr(input.length - 3, input.length));
        input = input.substr(0, input.length - 3);
    }
    return `${input},${out.reverse().join(',')}`;
};

exports.assertEmbedPermission = (channel, member) => {
    if (!(channel instanceof Discord.TextChannel))
        throw bot.client.consts.phrase('require_instance', { instance: 'Discord.TextChannel' });

    if (!(member instanceof Discord.GuildMember))
        throw bot.client.consts.phrase('require_instance', { instance: 'Discord.GuildMember' });

    if (!channel.permissionsFor(member).has('EMBED_LINKS'))
        throw 'No permission to use embed in this channel!';
};

exports.embed = (title = '', description = '', fields = [], options = {}) => {
    const url = options.url || '';
    const color = options.color || this.randomColor();
    const footer = options.footer || '';
    const author = typeof options.author == 'string' ? options.author : '';
    let maxLength = 2000;

    fields.length = Math.min(25, fields.length);

    fields = fields.map(obj => {
        maxLength -= obj.name.length + obj.value.length;

        if (options.inline)
            obj.inline = true;

        if (obj.value.length > 1024)
            obj.value = truncate(obj.value, 1023);

        return obj;
    });

    if (title.length > 256)
        title = truncate(title, 255);
    if (url !== '')
        description += '\n';

    // NOTE: Temporary countermeasure against
    // description length issue with Discord API
    maxLength -= title.length + footer.length + author.length;
    if (description.length > maxLength)
        description = truncate(description, maxLength - 1);

    return new Discord.RichEmbed({ fields, video: options.video || url })
        .setTitle(title)
        .setColor(color)
        .setDescription(description)
        .setImage(options.image || url)
        .setTimestamp(timestampToDate(options.timestamp) || null)
        .setFooter(footer, options.avatarFooter ? bot.client.user.avatarURL : (options.footerIcon || null))
        .setAuthor(author)
        .setThumbnail(options.thumbnail || null);
};

const timestampToDate = timestamp => {
    if (timestamp === true) {
        return new Date();
    }
    if (typeof timestamp === 'number') {
        return new Date(timestamp);
    }
    return timestamp;
};

/**
 * utils.formatEmbed - This is a function to format embed
 * with a predefined structure (primarily used to format
 * fields, so it is required to specify the fields)
 *
 * @param {string} [title=]
 * @param {string} [description=]
 * @param {Object} nestedFields
 * @param {Object} [options={}]
 *
 * @returns {Discord.RichEmbed}
 */
exports.formatEmbed = (title = '', description = '', nestedFields, options = {}) => {
    if (!nestedFields || typeof nestedFields != 'object')
        throw 'Nested fields info is not an object!';

    const fields = nestedFields.map(parentField => {
        const tmp = {
            name: `${parentField.icon || '❯'}\u2000${parentField.title}`,
            value: parentField.fields.map(field => {
                let t = '';
                if (options.code)
                    t += '```' + options.code + '\n';
                if (field.name)
                    t += `•\u2000${field.name}: `;
                if (field.value.length > 1024 && field.hasOwnProperty('alt'))
                    t += field.alt;
                else
                    t += field.value;
                if (options.code)
                    t += '\n```';
                return t.replace(/^ +| +?$/g, ''); // t.trim();
            }).join('\n')
        };
        if (parentField.inline)
            tmp.inline = parentField.inline;
        return tmp;
    });

    if (options.simple) {
        let content = '';
        for (let i = 0; i < fields.length; i++)
            content += `\n**${fields[i].name}:**\n${fields[i].value}`;
        if (options.footer)
            content += `\n*${options.footer}*`;
        return content.trim();
    }

    delete options.code;
    delete options.simple;
    return this.embed(title, description, fields, options);
};

exports.formatLargeEmbed = (title = '', description = '', values, options = {}) => {
    if (!values || typeof values != 'object')
        throw 'Values info is not an object!';

    if (!values.delimeter || !values.children)
        throw 'Missing required properties from values info!';

    const embed = this.embed(title, description, [], options);

    const sections = [];
    let temp = [];
    for (const child of values.children) {
        if (!child)
            continue;

        if ((temp.join(values.delimeter).length ? temp.join(values.delimeter).length + values.delimeter.length + child.length : child.length) > 1024) {
            sections.push(temp);
            temp = [];
        }

        temp.push(child.trim());
    }
    sections.push(temp);

    sections.length = Math.min(25, sections.length);

    for (let section of sections) {
        if (section.length > 1024)
            section = truncate(section, 1023);

        embed.addField(values.sectionTitle || '---', section.join(values.delimeter), true);
    }

    return embed;
};

exports.parseArgs = (args, options) => {
    if (!options)
        return args;
    if (typeof options === 'string')
        options = [options];

    const optionValues = {};

    let i;
    for (i = 0; i < args.length; i++) {
        const arg = args[i];
        if (!arg.startsWith('-')) {
            break;
        }

        const label = arg.substr(1);

        if (options.indexOf(label + ':') > -1) {
            const leftover = args.slice(i + 1).join(' ');
            const matches = leftover.match(/^"(.+?)"/);
            if (matches) {
                optionValues[label] = matches[1];
                i += matches[0].split(' ').length;
            } else {
                i++;
                optionValues[label] = args[i];
            }
        } else if (options.indexOf(label) > -1) {
            optionValues[label] = true;
        } else {
            break;
        }
    }

    return {
        options: optionValues,
        leftover: args.slice(i)
    };
};

exports.multiSend = (channel, messages, delay) => {
    delay = delay || 100;
    messages.forEach((m, i) => {
        setTimeout(() => {
            channel.send(m);
        }, delay * i);
    });
};

exports.sendLarge = (channel, largeMessage, options = {}) => {
    let message = largeMessage;
    const messages = [];
    const prefix = options.prefix || '';
    const suffix = options.suffix || '';

    const max = 2000 - prefix.length - suffix.length;

    while (message.length >= max) {
        let part = message.substr(0, max);
        let cutTo = max;
        if (options.cutOn) {
            cutTo = part.lastIndexOf(options.cutOn);
            part = part.substr(0, cutTo);
        }
        messages.push(prefix + part + suffix);
        message = message.substr(cutTo);
    }

    if (message.length > 1) {
        messages.push(prefix + message + suffix);
    }

    this.multiSend(channel, messages, options.delay);
};

exports.playAnimation = (msg, delay, list) => {
    if (list.length < 1)
        return;

    const next = list.shift();
    const start = this.now();

    msg.edit(next).then(() => {
        const elapsed = this.now() - start;

        setTimeout(() => {
            this.playAnimation(msg, delay, list);
        }, Math.max(50, delay - elapsed));
    }).catch(msg.error);
};

exports.now = () => {
    const now = process.hrtime();
    return now[0] * 1e3 + now[1] / 1e6;
};

/**
 * utils.fromNow - This function will return "x days ago" if
 * it is more than a single day, but will still return hours,
 * minutes and seconds when it is less than a single day.
 *
 * @param {Date} date
 *
 * @returns {string}
 */
exports.fromNow = date => {
    if (!date)
        return false;

    const days = moment().diff(date, 'd');

    if (days > 1)
        return `${days} days ago`;
    else
        return moment(date).fromNow();
};

exports.humanizeDuration = (ms, maxUnits = undefined, short = false) => {
    const round = ms > 0 ? Math.floor : Math.ceil;
    const parsed = [
        {
            int: round(ms / 604800000),
            sin: 'week', plu: 'weeks', sho: 'w'
        },
        {
            int: round(ms / 86400000) % 7,
            sin: 'day', plu: 'days', sho: 'd'
        },
        {
            int: round(ms / 3600000) % 24,
            sin: 'hour', plu: 'hours', sho: 'h'
        },
        {
            int: round(ms / 60000) % 60,
            sin: 'minute', plu: 'minutes', sho: 'm'
        },
        {
            int: (round(ms / 1000) % 60) + (round(ms) % 1000 / 1000),
            sin: 'second', plu: 'seconds', sho: 's'
        }
    ];

    const result = [];
    for (let i = 0; i < parsed.length; i++) {
        if (!result.length && parsed[i].int == 0)
            continue;

        if (result.length >= maxUnits)
            break;

        let int = parsed[i].int;
        if (i == parsed.length - 1 && !result.length)
            int = int.toFixed(1);
        else
            int = int.toFixed(0);

        result.push(`${int}${short ? parsed[i].sho : ' ' + (int == 1 ? parsed[i].sin : parsed[i].plu)}`);
    }

    return result.map((res, i) => {
        if (!short) {
            if (i == result.length - 2)
                return res + ' and';
            else if (i != result.length - 1)
                return res + ',';
        }
        return res;
    }).join(' ');
};

/**
 * utils.getMsg - A Promise which will return a cached message from a
 * channel. If msgId is not provided, then it will return the previous
 * message. Optionally, it can also be asked to fetch message instead.
 *
 * @param {(Discord.TextChannel|Discord.DMChannel)} channel
 * @param {number} [msgId=undefined]
 * @param {number} [curMsg=undefined]
 *
 * @returns {Discord.Message}
 */
exports.getMsg = (channel, msgId = undefined, curMsg = undefined) => {

    return new Promise((resolve, reject) => {
        if (!(channel instanceof Discord.TextChannel || channel instanceof Discord.DMChannel))
            return reject(bot.client.consts.phrase('require_instance', { instance: 'Discord.TextChannel or Discord.DMChannel' }));

        if (msgId && isNaN(parseInt(msgId)))
            return reject('Invalid message ID. It must only contain numbers!');

        const foundMsg = channel.messages.get(msgId || channel.messages.keyArray()[channel.messages.size - 2]);

        if (!foundMsg && curMsg) {
            channel.fetchMessages({
                limit: 1,
                around: msgId,
                before: curMsg
            }).then(msgs => {
                if (msgs.size < 1 || (msgId ? msgs.first().id != msgId : false))
                    return reject('Message could not be fetched from the channel!');

                resolve(msgs.first());
            }).catch(reject);
        } else if (foundMsg) {
            resolve(foundMsg);
        } else {
            reject('Message could not be found in the channel!');
        }
    });
};

/**
 * utils.getGuildMember - A function which will return
 * a user from the guild by @mention, full tag or
 * partial/case-insensitive display name (has fallback feature).
 *
 * @param {Discord.Guild} guild
 * @param {string} [keyword=undefined]
 * @param {Discord.GuildMember} [fallback=undefined]
 *
 * @returns {Array}
 */
exports.getGuildMember = (guild, keyword = undefined, fallback = undefined) => {
    if (keyword) {
        if (!(guild instanceof Discord.Guild))
            throw bot.client.consts.phrase('require_instance', { instance: 'Discord.Guild' });

        keyword = keyword.trim();

        const isMention = /<@!?(\d+?)>/g.exec(keyword);
        if (isMention)
            return [guild.members.get(isMention[1]), true];

        const isTag = keyword.indexOf('#') !== -1;
        if (isTag)
            return [guild.members.find(m => m.user && m.user.tag == keyword), false];

        const filter = guild.members.filter(m =>
            (m.nickname && m.nickname.toLowerCase().indexOf(keyword.toLowerCase()) !== -1) ||
            (m.user && m.user.username.toLowerCase().indexOf(keyword.toLowerCase()) !== -1)
        );

        if (filter.size > 1)
            throw bot.client.consts.phrase('found_x_error', { x: `${filter.size} members` });
        else if (filter.size == 1)
            return [filter.first(), false];
    } else if (fallback) {
        return [fallback, false];
    }

    throw bot.client.consts.phrase('x_not_found', { x: 'Guild member' });
};

exports.getGuildRole = (guild, keyword) => {
    if (!(guild instanceof Discord.Guild))
        throw bot.client.consts.phrase('require_instance', { instance: 'Discord.Guild' });

    keyword = keyword.trim();

    const find = guild.roles.find('name', keyword);

    if (find)
        return find;

    const filter = guild.roles.filter(r => {
        return r.name.toLowerCase().indexOf(keyword.toLowerCase()) !== -1;
    });

    if (filter.size > 1)
        throw bot.client.consts.phrase('found_x_error', { x: `${filter.size} roles` });
    else if (filter.size == 1)
        return filter.first();

    throw bot.client.consts.phrase('x_not_found', { x: 'Guild role' });
};

exports.pad = (pad, str, padLeft) => {
    if (typeof str === 'undefined')
        return pad;
    if (padLeft) {
        return (pad + str).slice(-pad.length);
    } else {
        return (str + pad).substring(0, pad.length);
    }
};

exports.getHostName = url => {
    const match = url.match(/:\/\/(www[0-9]?\.)?(.[^/:]+)/i);
    if (match != null && match.length > 2 && typeof match[2] === 'string' && match[2].length > 0) {
        return match[2];
    } else {
        return null;
    }
};

exports.cleanCustomEmojis = text => {
    if (!text)
        return '';

    return text.replace(/<(:\w+?:)\d+?>/g, '$1');
};

exports.fetchGuildMembers = (guild, cache = false) => {
    if (!(guild instanceof Discord.Guild))
        throw bot.client.consts.phrase('require_instance', { instance: 'Discord.Guild' });

    return new Promise((resolve, reject) => {
        if (cache)
            return resolve({
                guild,
                time: ''
            });

        const beginTime = process.hrtime();
        guild.fetchMembers().then(g => {
            const elapsedTime = process.hrtime(beginTime);
            const elapsedTimeNs = elapsedTime[0] * 1e9 + elapsedTime[1];
            resolve({
                guild: g,
                time: elapsedTimeNs < 1e9 ? `${(elapsedTimeNs / 1e6).toFixed(3)} ms` : `${(elapsedTimeNs / 1e9).toFixed(3)} s`
            });
        }).catch(reject);
    });
};

exports.haste = (content, suffix = '', raw = false) => {
    return new Promise((resolve, reject) =>
        snekfetch.post('https://hastebin.com/documents').send(stripIndents`
            ${content}

            Dumped with Lightbringer ${process.env.npm_package_version}. Yet another Discord self-bot written with discord.js.
            https://github.com/BobbyWibowo/Lightbringer
        `).then(res => {
            if (!res.body || !res.body.key)
                return reject('Failed to upload, no key was returned!');

            resolve(`https://hastebin.com/${raw ? 'raw/' : ''}${res.body.key}${suffix ? `.${suffix}` : ''}`);
        }).catch(reject)
    );
};

/**
 * NOTE: One-liner utils...
 */

exports.cleanUrl = url => encodeUrl(url.replace(/ /g, '+')).replace(/\(/g, '%40').replace(/\)/g, '%41');

exports.toYesNo = bool => bool ? 'yes' : 'no';

exports.toCode = (text, lang = '') => `\`\`\`${lang}\n${text}\n\`\`\``;
