const snekfetch = require('snekfetch');
const moment = require('moment');
const timeIsURL = 'https://time.is/';

exports.run = (bot, msg, args) => {
    const location = args.join(' ') || bot.config.defaultTimeZone || false;

    snekfetch.get(`${timeIsURL}${location}`).then(res => {
        const text = res.text || res.body.toString();

        const date = text.match(/<div id="dd" class="w90 tr" onclick="location='\/calendar'" title="Click for calendar">([^]+?)<\/div>/)[1];
        const time = text.match(/<div id="twd">([^]+?)<\/div>/)[1].replace(/<span id="ampm" style="font-size:21px;line-height:21px">(AM|PM)<\/span>/, ' $1');
        const place = text.match(/<div id="msgdiv"><h1>Time in ([^]+?) now<\/h1>/)[1];
        const clock = bot.consts.clocks[parseInt(time.split(':')[0], 10) % 12];
        const tMoment = moment(`${date} ${time}`, 'dddd, MMMM D, YYYY HH:mm:ss A');

        msg.edit(`${clock} The time in '${place}' is ${tMoment.format(bot.consts.fullDateFormat)}.`);
    }).catch(err => msg.error(err.status == 404 ? `Location ${location} not found.` : err));
};

exports.info = {
    name: 'time',
    usage: 'time [location]',
    description: 'Prints current time in yours or a particular location (using Time.is)',
    credits: '1Computer1'
};
