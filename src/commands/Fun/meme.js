const snekfetch = require('snekfetch');

let templates = [];

snekfetch.get('https://memegen.link/templates/').then(res => {
    templates = [];
    const promises = [];
    for (const key in res.body) {
        promises.push(_loadMeme(res.body[key]));
    }

    Promise.all(promises).then(() => {
        templates = templates.filter(e => !!e);
        templates.sort((a, b) => a.name.localeCompare(b.name));
    }).catch(console.error);
}).catch(console.error);

const _loadMeme = (url) => {
    return snekfetch.get(url).then(res => {
        templates.push({
            name: url.replace(/https\:\/\/memegen\.link\/api\/templates\/(.*)/, '$1'),
            url: url.replace('/api/templates', ''),
            styles: res.body.styles
        });
    });
};

const getMeme = (name) => {
    return templates.find(m => m.name.toLowerCase() === name.toLowerCase());
};

const cleanInput = (input) => {
    if (!input) return '';
    return input.replace(/"/g, '\'\'').replace(/\#/g, '~h')
        .replace(/\-/g, '--').replace(/\_/g, '__')
        .replace(' ', '_').replace(/\?/g, '~q')
        .replace(/\%/g, '~p').replace(/\//g, '~s');
};

exports.run = (bot, msg, args) => {
    if (templates.length < 1)
        throw 'The memes haven\'t loaded yet!';

    if (/^(h(elp)?|\?)$/i.test(args[0]))
        return bot.commands.get('help').run(bot, msg, 'meme');

    if (/^(ls|list|s(earch)?)$/i.test(args[0])) {
        msg.delete();
        return msg.channel.send('',
            { embed: bot.utils.embed('Available Memes', '*This message will vanish in 30 seconds*\n\n' + templates.map(meme => `\`${meme.name}\``).join(', ')) }
        ).then(m => m.delete(30000));
    }

    if (/^(i(nf(o)?)?)$/i.test(args[0])) {
        if (args.length < 2)
            throw 'You must provide a meme to get info about!';

        const info = getMeme(args[1]);
        if (!info)
            throw `That is not a valid meme! Do \`${bot.config.prefix}${this.info.name} list\` to see available memes.`;

        msg.delete();
        return msg.channel.send('', { embed:
            bot.utils.embed(`\`${info.name}\``, `Styles: ${info.styles && info.styles.length > 1 ? info.styles.map(s => `\n- \`${s}\``).join('') : 'None'}`)
        }).then(m => m.delete(15000));
    }

    const input = args.join(' ');
    const parts = input.split('|').map(p => p.trim());

    if (parts.length < 3)
        throw `No message was provided! Do \`${bot.config.prefix}help ${this.info.name}\` for info on how to use this.`;

    const meme = getMeme(args[0]);
    if (!meme)
        throw `That is not a valid meme! Do \`${bot.config.prefix}${this.info.name} list\` to see available memes.`;

    const topText = cleanInput(parts[1]);
    const bottomText = cleanInput(parts[2]);

    if (!topText || !bottomText)
        throw 'Empty message!';

    let url = `${meme.url}/${cleanInput(parts[1])}/${cleanInput(parts[2])}.jpg`;
    if (parts[3]) url += `?alt=${parts[3]}`;

    msg.edit('🔄').then(() => {
        msg.channel.send('', { file: { attachment: url, name: parts[0] + '.jpg' } })
            .then(() => msg.delete())
            .catch(msg.error);
    });
};

exports.info = {
    name: 'meme',
    usage: 'meme list | info <name> | [<name> | <line 1> | <line 2> | [style]]',
    examples: [
        'meme info sad-biden',
        'meme facepalm | please, oh please | rtfm',
        'meme sad-biden | sad joe biden | doesn\'t have discord | scowl'
    ]
};
