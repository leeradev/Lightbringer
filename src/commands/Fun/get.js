const snekfetch = require('snekfetch');
const truncate = require('truncate');
const txtgen = require('txtgen');
const dotProp = require('dot-prop');

const apis = [
    {
        name: 'joke',
        regex: '^j(oke)?$',
        api: 'http://api.icndb.com/jokes/random',
        prop: 'value.joke'
    },
    {
        name: 'pun',
        regex: '^p(un)?$',
        api: 'https://pun.andrewmacheret.com/',
        prop: 'pun'
    },
    {
        name: 'yomomma',
        regex: '^y(omomma)?$',
        api: 'http://api.yomomma.info/',
        parseJson: true,
        prop: 'joke'
    },
    {
        name: 'datefact',
        regex: '^d(ate(fact)?)?$',
        api: 'http://numbersapi.com/random/date?json',
        prop: 'text'
    },
    {
        name: 'mathfact',
        regex: '^m(ath(fact)?)?$',
        api: 'http://numbersapi.com/random/math?json',
        prop: 'text'
    },
    {
        name: 'yearfact',
        regex: '^ye(ar(fact)?)?$',
        api: 'http://numbersapi.com/random/year?json',
        prop: 'text'
    },
    {
        name: 'sentence',
        regex: '^s(en(t(ence)?)?)?$',
        func: () => txtgen.sentence()
    },
    {
        name: 'paragraph',
        regex: '^pa(ra(graph)?)?$',
        func: () => txtgen.paragraph()
    },
    {
        name: 'article',
        regex: '^a(rt(icle)?)?$',
        func: () => txtgen.article()
    }
];

exports.run = (bot, msg, args) => {
    if (args.length < 1)
        return msg.error(`You must specify a type! Available types: ${apis.map(a => `\`${a.name}\``).join(', ')}.`);

    new Promise((resolve, reject) => {
        const error = 'Could not fetch data';

        for (const a of apis) {
            if (new RegExp(a.regex, 'i').test(args[0])) {
                if (a.api)
                    snekfetch.get(a.api).then(res => {
                        if (!res || !res.body)
                            reject(error);

                        const body = a.parseJson ? JSON.parse(res.body) : res.body;

                        if (dotProp.has(body, a.prop))
                            resolve(dotProp.get(body, a.prop));
                        else
                            reject(error);
                    }).catch(reject);
                else
                    resolve(a.func());

                break;
            }
        }
    }).then(result =>
        msg.edit(truncate(result, 1999))
    ).catch(msg.error);
};

exports.info = {
    name: 'get',
    usage: 'get [type]',
    description: 'Get some things from some APIs',
    aliases: ['g', 'f', 'fetch']
};
