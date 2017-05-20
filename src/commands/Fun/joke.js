const snekfetch = require('snekfetch');

exports.run = (bot, msg) => {
    snekfetch.get('http://tambal.azurewebsites.net/joke/random').then(res => {
        if (!res || !res.body)
            return msg.error('Could not fetch data');

        msg.edit(res.body.joke);
    });
};

exports.info = {
    name: 'joke',
    usage: 'joke',
    description: 'Gives a random joke from http://tambal.azurewebsites.net/joke/random'
};
