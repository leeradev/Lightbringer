const filesize = require('filesize');

exports.run = (bot, msg, args) => {
    if (msg.guild)
        bot.utils.assertEmbedPermission(msg.channel, msg.member);

    const parsed = bot.utils.parseArgs(args, ['c']);
    const channel = bot.channels.get(parsed.leftover[1]) || msg.channel;

    bot.utils.getMsg(channel, parsed.leftover[0], msg.id).then(m => {
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

        if (channel.id != msg.channel.id)
            nestedFields[0].fields.push(
                {
                    name: 'Channel',
                    value: channel.type == 'text' ? `#${channel.name} (${channel.id})` :  (channel.type == 'dm' ? `DM with ${channel.recipient.tag}` : channel.type.toUpperCase())
                }
            );

        if (channel.type == 'text' && channel.guild.id != msg.guild.id)
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

        msg.edit(msg.content, { embed:
            bot.utils.formatEmbed('', parsed.options.c ? m.cleanContent : m.toString(), nestedFields, options)
                .setAuthor(`${m.author.tag} (${m.author.id})`, m.author.displayAvatarURL)
        }).catch(msg.error);
    }).catch(msg.error);
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
