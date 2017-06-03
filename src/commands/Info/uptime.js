exports.run = (bot, msg) => {
    msg.edit(`⌛\u2000Uptime: ${bot.utils.humanizeDuration(bot.uptime)}`).catch(msg.error);
};

exports.info = {
    name: 'uptime',
    usage: 'uptime',
    description: 'Shows the bot\'s uptime'
};
