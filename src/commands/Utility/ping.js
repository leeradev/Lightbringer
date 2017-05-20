exports.run = (bot, msg) => {
    msg.channel.send('🏓\u2000Pong!').then(m => {
        m.edit(`${m.content} - Time taken: **${m.createdTimestamp - msg.createdTimestamp}ms** (heartbeat: **${bot.ping.toFixed(0)}ms**).`);
    });
};

exports.info = {
    name: 'ping',
    usage: 'ping',
    description: 'Pings the bot'
};
