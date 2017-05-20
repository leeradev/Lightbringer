exports.run = (bot, msg, args) => {
    const channel = bot.channels.get(args[1]) || msg.channel;

    bot.utils.getMsg(channel, args[0], msg.id).then(m => {
        const msgOps = {};

        if (m.attachments.size)
            msgOps.files = [ { attachment: m.attachments.first().url, name: m.attachments.first().filename } ];

        if (m.embeds.length) {
            let richEmbed;
            for (let i = 0; i < m.embeds.length; i++) {
                if (m.embeds[i].type == 'rich') {
                    richEmbed = m.embeds[i];
                    break;
                }
            }

            if (richEmbed) {
                if (msg.guild)
                    bot.utils.assertEmbedPermission(msg.channel, msg.member);

                msgOps.embed = bot.utils.embed(richEmbed.title, richEmbed.description, [], {
                    color: richEmbed.hexColor,
                    footer: richEmbed.footer && richEmbed.footer.text,
                    footerIcon: richEmbed.footer && richEmbed.footer.iconURL,
                    thumbnail: richEmbed.thumbnail && richEmbed.thumbnail.url,
                    image: richEmbed.image && richEmbed.image.url
                });

                if (richEmbed.author)
                    msgOps.embed.setAuthor(richEmbed.author.name, richEmbed.author.iconURL, richEmbed.author.url);

                for (let i = 0; i < richEmbed.fields.length; i++)
                    msgOps.embed.addField(richEmbed.fields[i].name, richEmbed.fields[i].value, richEmbed.fields[i].inline);
            }
        }

        if (msgOps.files)
            msg.channel.send(m.content, msgOps).then(() => msg.delete()).catch(msg.error);
        else
            msg.edit(m.content, msgOps).catch(msg.error);
    }).catch(msg.error);
};

exports.info = {
    name: 'clone',
    usage: 'clone [id] [channel]',
    description: 'Clones the message with the given ID (may optionally set a channel)',
    aliases: ['copy']
};
