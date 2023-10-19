const dicUrl = 'https://api.dictionaryapi.dev/api/v2/entries/en/';
const maxUncert = .3;

let localDic = { any: {} };

async function getWordInfo(word) {
    try {
        const response = await fetch(dicUrl + word.toLowerCase());
        return new Word((await response.json())[0]);
    } catch (error) {
        return new Word({ word: word });
    }
}



let patternLists = {
    greeting: [
        new Pattern(
            [
                { key: 'partOfSpeech', eq: ['exclamation', 'interjection'] },
                { key: 'def', has: ['greeting'] }
            ],
            .1
        ),
        new Pattern(
            [
                { key: 'def', has: ['greeting'] }
            ],
            .6
        )
    ],
    user: [new Pattern([{ key: 'word', eq: ['i', 'me', 'myself', 'my', 'mine'] }], 0)],
    shitchat: [new Pattern([{ key: 'word', starts: ['you'], eq: ['thou', 'thee', 'thy', 'thyself', 'thine', 'ye'], has: ['shitchat', 'shit-chat'] }], .01)],
    bad: [new Pattern([{ key: 'word', has: ['fuck'] }])]
}

function match(wordData) {
    for (let key in patternLists) {
        const ps = patternLists[key]
        let uncert = ps.reduce((u, p) => u * p.check(wordData), 1);
        wordData.patterns[key] = uncert;
        if (uncert <= maxUncert) {
            localDic[key] ||= {};
            localDic[key][wordData.word] = wordData;
        }
    }
    return wordData;
}




async function reply(msg) {
    let words = msg.toLowerCase().split(' ').map(async w => match(await (getWordInfo(w))));
    let rep = "";
    for (i in words) {
        words[i] = match(await words[i]);
    }

    if (words.some(w => w.patterns.greeting <= maxUncert)) {
        rep += 'Hi there! '
    }
    if (words.some(w => w.patterns.shitchat <= maxUncert)) {
        rep += 'That\'s me! '
        let start = 0;
        let lastI = words.length - 1;
        if (words[lastI].patterns.shitchat <= maxUncert) {
            rep += msg.split(' ').slice(0, lastI).join(' ') + ' you too! '
        }
    }

    if (words.some(w => w.patterns.bad <= maxUncert)) {
        rep += 'Fuck you!'
    }
    return rep || 'Sorry, I don\'t understand';
}