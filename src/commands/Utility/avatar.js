exports.run = (bot, msg, args) => {
    const parsed = bot.utils.parseArgs(args, ['e']);

    if (msg.guild && parsed.options.e)
        bot.utils.assertEmbedPermission(msg.channel, msg.member);

    const keyword = parsed.leftover.join(' ');
    const get = bot.utils.getGuildMember(msg.guild, keyword, msg.member);
    const member = get[0];
    const user = member ? member.user : bot.user;
    const avatarURL = user.displayAvatarURL.replace('cdn.discordapp.com', 'images.discordapp.net');

    msg.edit(`${get[1] ? user : user.tag}'s avatar:${parsed.options.e ? '' : `\n${avatarURL}`}`, parsed.options.e ? { embed:
        bot.utils.embed('', `[Direct link](${avatarURL})`, [], {
            image: avatarURL
        })
    } : {}).catch(msg.error);
};

exports.info = {
    name: 'avatar',
    usage: 'avatar [user]',
    description: 'Get yours or another user\'s avatar',
    aliases: ['ava'],
    options: [
        {
            name: '-e',
            usage: '-e',
            description: 'Shows avatar in embed'
        }
    ]
};
