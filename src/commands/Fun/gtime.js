const snekfetch = require('snekfetch');
const moment = require('moment');
const googleMapsApi = 'https://maps.googleapis.com/maps/api';

exports.run = (bot, msg, args) => {
    if (!bot.config.googleApiKey || bot.config.googleApiKey.length < 1)
        throw 'Google API key is missing from config.json';

    const location = args.join(' ') || bot.config.defaultTimeZone || false;

    if (!location)
        throw 'Please specify a location to lookup!';

    msg.edit(`🔄\u2000Fetching time info for '${location}' from Google Maps API\u2026`).then(() => {
        snekfetch.get(`${googleMapsApi}/geocode/json?address=${encodeURIComponent(location)}&key=${bot.config.googleApiKey}`).then(res => {
            if (!res || !res.body)
                return msg.error('Could not fetch geocode data from Google Maps API!');

            if (res.body.error_message)
                return msg.error(res.body.error_message);

            if (res.body.status !== 'OK')
                return msg.error(res.body.status);

            const location = res.body.results[0].geometry.location;
            const unixTimestamp = new Date().getTime() / 1e3;

            snekfetch.get(`${googleMapsApi}/timezone/json?location=${location.lat},${location.lng}&timestamp=${unixTimestamp}&key=${bot.config.googleApiKey}`).then(res => {
                if (!res || !res.body)
                    return msg.error('Could not fetch timezone data from Google Maps API!');

                if (res.body.error_message) // NOTE: May not exist in timezone API (exists in geocode API)
                    return msg.error(res.body.error_message);

                if (res.body.status !== 'OK') // NOTE: May not exist in timezone API (exists in geocode API)
                    return msg.error(res.body.status);

                const time = moment.unix(unixTimestamp + res.body.rawOffset);
                const clock = bot.consts.clocks[time.hour() % 12];

                msg.edit(`${clock} The time in '${res.body.timeZoneId} (${res.body.timeZoneName})' is ${time.format(bot.consts.fullDateFormat)}.`);
            }).catch(msg.error);
        }).catch(msg.error);
    });
};

exports.info = {
    name: 'gtime',
    usage: 'gtime [location]',
    description: 'Prints current time in yours or a particular location (using Google Maps API)'
};
