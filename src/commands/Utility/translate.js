const translate = require('google-translate-api');
const stripIndents = require('common-tags').stripIndents;

exports.run = (bot, msg, args) => {
    const parsed = bot.utils.parseArgs(args, ['e', 'f:']);

    if (msg.guild && !parsed.options.e)
        bot.utils.assertEmbedPermission(msg.channel, msg.member);

    if (parsed.leftover.length < 2)
        throw 'You must provide a language and some text to translate!';

    const lang = parsed.leftover[0];
    const input = parsed.leftover.slice(1).join(' ');

    msg.edit('🔄\u2000Translating your text...').then(() => {
        translate(input, { from: parsed.options.f, to: lang }).then(res => {
            if (parsed.options.e) msg.edit(res.text);
            else {
                msg.edit({ embed:
                    bot.utils.embed('', stripIndents`
                        **From:** __\`${parsed.options.f || '[auto]'}\`__
                        **To:** __\`${lang}\`__
                        **Input:**\n${bot.utils.toCode(input)}
                        **Output:**\n${bot.utils.toCode(res.text)}
                    `)
                });
            }
        }).catch(msg.error);
    });
};

exports.info = {
    name: 'translate',
    usage: 'translate <lang> <text>',
    description: 'Translates text from/to any language',
    credits: 'Carbowix',
    options: [
        {
            name: '-e',
            description: 'Edits your message with the translation instead of showing an embed'
        },
        {
            name: '-f',
            usage: '-f <language>',
            description: 'Sets the `from` language, this is `auto` by default'
        }
    ]
};
