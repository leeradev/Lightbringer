exports.run = (bot, msg) => {
    const timestamp = new Date().getTime();
    msg.edit('🏓\u2000Pong!').then(() => {
        msg.edit(`${msg.content} - Time taken: **${new Date().getTime() - timestamp}ms** (heartbeat: **${bot.ping.toFixed(0)}ms**).`);
    });
};

exports.info = {
    name: 'ping',
    usage: 'ping',
    description: 'Pings the bot'
};
