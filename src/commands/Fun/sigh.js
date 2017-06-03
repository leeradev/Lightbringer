const ascii = `
  _______   _________    _________   ,        ,
 /              |       /            |        |
|               |      |             |        |
|               |      |             |        |
 \\_____,        |      |  _______,   |________|
        \\       |      |         |   |        |
         |      |      |         |   |        |
         |      |      |         |   |        |
  ______/   ____|____   \\________|   |        |
\u200b
`;

exports.run = (bot, msg) => {
    msg.edit(bot.utils.toCode(ascii));
};

exports.info = {
    name: 'sigh',
    usage: 'sigh',
    description: 'Dramatic sigh text'
};
