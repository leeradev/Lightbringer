/* eslint-disable no-unused-vars */

const beautify = require('js-beautify').js_beautify;
const Discord = require('discord.js');

exports.run = (bot, msg, args) => {
    const parsed = bot.utils.parseArgs(args, ['e', 'd']);

    if (parsed.leftover.length < 1)
        throw 'You must provide a command to run!';

    if (parsed.options.e && msg.guild)
        bot.utils.assertEmbedPermission(msg.channel, msg.member);

    const input = parsed.leftover.join(' ');
    const beginTime = process.hrtime();

    new Promise(resolve => {
        new Promise(resolve => {
            resolve(eval(input));
        }).then(output =>
            resolve({ output, error: false })
        ).catch(error =>
            resolve({ output: null, error })
        );
    }).then(result => {
        const elapsedTime = process.hrtime(beginTime);
        const elapsedTimeNs = elapsedTime[0] * 1e9 + elapsedTime[1];

        let fallback = '';
        if (result.error) {
            console.error(`Evaluation error:\n${(result.error.stack || result.error).toString()}`);
        } else if (result.output !== undefined && result.output !== null) {
            fallback += 'Output too long ';
            switch (result.output.constructor.name) {
            case 'Array':
            case 'Object':
                fallback += `(${result.output.constructor.name == 'Array' ? 'array' : 'object'} keys: ${Object.keys(result.output).length})`;
                break;
            case 'Collection':
                fallback += `(collection size: ${result.output.size})`;
                break;
            case 'String':
                fallback += `(string length: ${result.output.length})`;
                break;
            default:
                fallback += '(check console)';
            }
            fallback += '.';
        }

        let disout = result.error ? result.error.toString() : require('util').inspect(result.output, { depth: 0 });
        // NOTE: Replace token
        disout = disout.replace(new RegExp(`${bot.token.split('').join('[^]{0,2}')}|${bot.token.split('').reverse().join('[^]{0,2}')}`, 'g'), '<Token>');
        // NOTE: Replace path
        disout = disout.replace(new RegExp(bot.parentDirectory, 'g'), '<Parent>');

        const timeTaken = elapsedTimeNs < 1e9 ? `${(elapsedTimeNs / 1e6).toFixed(3)} ms` : `${(elapsedTimeNs / 1e9).toFixed(3)} s`;
        const formatted = bot.utils.formatEmbed('', '',
            [
                {
                    icon: '🔡',
                    title: 'Input',
                    fields: [
                        {
                            value: parsed.options.d ? input : beautify(input)
                        }
                    ]
                },
                {
                    icon: result.error ? '☠' : '🆗',
                    title: result.error ? 'Error' : 'Output',
                    fields: [
                        {
                            value: disout,
                            alt: fallback
                        }
                    ]
                }
            ],
            {
                footer: `Node.js - Time taken: ${timeTaken}`,
                footerIcon: 'https://a.safe.moe/UBEUl.png',
                color: '#6cc24a',
                simple: !parsed.options.e,
                code: 'js'
            }
        );

        if (typeof formatted == 'string')
            msg.edit(formatted);
        else
            msg.channel.send({ embed: formatted }).then(() => msg.delete());
    });
};

exports.info = {
    name: 'eval',
    usage: 'eval [options] <command>',
    description: 'Evaluates arbitrary JavaScript',
    options: [
        {
            name: '-e',
            usage: '-e',
            description: 'Display in embed'
        },
        {
            name: '-d',
            usage: '-d',
            description: 'Disable input auto-beautifier'
        }
    ]
};
