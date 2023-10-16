const dicUrl = 'https://api.dictionaryapi.dev/api/v2/entries/en/';

let localDic = {};

async function getWordInfo(word) {
    try {
        const response = await fetch(dicUrl + word.toLowerCase());
        return new Word((await response.json())[0]);
    } catch (error) {
        return new Word({ word: word });
    }
}



let patterns = {
    greeting: [
        { key: 'partOfSpeech', eq: ['exclamation', 'interjection'] },
        { key: 'def', has: ['greeting'] }
    ]
}

function match(wordData) {
    for (let key in patterns) {
        const p = patterns[key]
        //If some definition matches every condition of pattern p
        if (p.every(c =>
            wordData.meanings.some(m =>
                c.eq?.includes(m[c.key]) ||
                c.has?.some(e =>
                    m[c.key].includes(e)
                )
            )
        )) {
            wordData.patterns.add(key);
            localDic[key] ||= {};
            localDic[key][wordData.word] = wordData;
        }
    }
    return wordData;
}


class Word {
    constructor(data) {
        this.word = data.word;
        this.meanings = data.meanings || [];
        this.meanings.forEach(m => m.def = m.definitions[0].definition.toLowerCase());
        this.pos = this.meanings.map(m => m.partOfSpeech);
        this.patterns = new Set();
    }
}

async function reply(msg) {
    let words = msg.toLowerCase().split(' ').map(async w => match(await (getWordInfo(w))));
    for (i in words) {
        words[i] = match(await words[i]);
    }
    if (words.some(w => w.patterns.has('greeting'))) {
        return 'Hi there'
    }
    return 'Sorry, I don\'t understand'
}
window.onload = function () {
    const replyDiv = document.getElementById('reply');
    const input = document.getElementById('input');
    document.onkeyup = async function (ev) {
        if (ev.key === 'Enter') {
            replyDiv.innerHTML = await reply(input.value)
        }
    }
}