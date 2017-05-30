const filesize = require('filesize');

exports.run = (bot, msg, args, auto = undefined) => {
    if (auto)
        bot.utils.assertEmbedPermission(auto.target, auto.target.guild.me);
    else
        bot.utils.assertEmbedPermission(msg.channel, msg.member);

    const parsed = bot.utils.parseArgs(args, ['c']);
    const channel = bot.channels.get(parsed.leftover[1]) || (auto ? auto.channel : msg.channel);

    new Promise(resolve =>
        auto ? resolve(auto.msg) : resolve(bot.utils.getMsg(channel, parsed.leftover[0], msg.id))
    ).then(m => {
        const options = {
            thumbnail: m.author.displayAvatarURL,
            timestamp: m.editedTimestamp || m.createdTimestamp
        };

        const nestedFields = [
            {
                title: 'Information',
                fields: [
                    {
                        name: 'ID',
                        value: m.id
                    }
                ]
            }
        ];

        if (channel.id != (auto ? auto.target.id : msg.channel.id))
            nestedFields[0].fields.push(
                {
                    name: 'Channel',
                    value: channel.type == 'text' ? `#${channel.name} (${channel.id})` :  (channel.type == 'dm' ? `DM with ${channel.recipient.tag}` : channel.type.toUpperCase())
                }
            );

        if (channel.type == 'text' && channel.guild.id != (auto ? auto.target.guild.id : msg.guild.id))
            nestedFields[0].fields.push(
                {
                    name: 'Guild',
                    value: `${channel.guild.name} (${channel.guild.id})`
                }
            );

        const attachments = m.attachments.map(a => {
            if ((a.width || a.height) && !options.image)
                options.image = a.url;

            return { value: `•\u2000[${a.filename}](${a.url}) - ${filesize(a.filesize)}` };
        });

        if (attachments.length)
            nestedFields.push(
                {
                    title: `Attachment${attachments.length != 1 ? 's' : ''}`,
                    fields: attachments
                }
            );

        const embed = bot.utils.formatEmbed('', parsed.options.c ? m.cleanContent : m.toString(), nestedFields, options)
            .setAuthor(`${m.author.tag} (${m.author.id})`, m.author.displayAvatarURL);

        if (auto)
            auto.target.send({ embed }).catch(err => console.error(err.stack));
        else
            msg.edit(msg.content, { embed }).catch(msg.error);
    }).catch(err =>
        msg ? msg.error : console.error(err.stack)
    );
};

exports.info = {
    name: 'quote',
    usage: 'quote [options] [id] [channel]',
    description: 'Quotes the message with the given ID (may optionally set a channel)',
    aliases: ['q'],
    options: [
        {
            name: '-c',
            usage: '-c',
            description: 'Quote clean version of the message'
        }
    ]
};
