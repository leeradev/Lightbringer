exports.run = (bot, msg, args) => {
    if (args.length < 1)
        throw bot.consts.phrase('empty_search');

    const query = args.join(' ');

    msg.edit(bot.consts.phrase('searching_x', { x: query, suf: ' from the last `100` messages' })).then(m => {
        msg.channel.fetchMessages({ limit: 100, before: msg.id }).then(messages => {
            const results = messages.filter(it => it.content.toLowerCase().indexOf(query.toLowerCase()) != -1);
            const output = results
                .map(it => `${formatDate(it.createdAt)} ${it.author.username}: ${it.content}`)
                .join('\n');
            m.editCode('log', output);
        }).catch(msg.error);
    }).catch(msg.error);
};

const formatDate = (date) => {
    return `[${_(date.getDay())}/${_(date.getMonth())}/${_(date.getYear() - 100)}] [${_(date.getHours())}:${_(date.getMinutes())}:${_(date.getSeconds())}]`;
};

const _ = (number) => {
    return number < 10 ? '0' + number : '' + number;
};

exports.info = {
    name: 'search',
    usage: 'search <#> <text>',
    description: 'Searches a number of messages for some text'
};
