const snekfetch = require('snekfetch');

exports.run = (bot, msg) => {
    snekfetch.get('http://tambal.azurewebsites.net/joke/random').then(res => {
        if (!res || !res.body)
            return msg.error('Could not fetch data');

        console.log(require('util').inspect(res));

        msg.edit(res.body.joke);
    }).catch(msg.error);
};

exports.info = {
    name: 'joke',
    usage: 'joke',
    description: 'Gives a random joke from http://tambal.azurewebsites.net/joke/random'
};
