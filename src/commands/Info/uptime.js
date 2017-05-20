exports.run = (bot, msg) => {
    if (msg.guild)
        bot.utils.assertEmbedPermission(msg.channel, msg.member);

    msg.edit(msg.content, { embed:
        bot.utils.embed('', `⌛\u2000Uptime: ${bot.utils.humanizeDuration(bot.uptime)}`)
    }).catch(msg.error);
};

exports.info = {
    name: 'uptime',
    usage: 'uptime',
    description: 'Shows the bot\'s uptime'
};
