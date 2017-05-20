const getos = require('getos');

exports.run = (bot, msg) => {
    if (msg.guild)
        bot.utils.assertEmbedPermission(msg.channel, msg.member);

    getos((err, res) => {
        if (err)
            return msg.error(err);

        msg.edit(msg.content, { embed:
            bot.utils.embed('', `🖥️\u2000OS: ${res.os == 'linux' ? `${res.dist} ${res.release}` : res.os}`)
        }).catch(msg.error);
    });
};

exports.info = {
    name: 'getos',
    usage: 'getos',
    description: 'Gets the name of the OS the bot is running on (for Linux-based system, this command will show the distro)'
};
