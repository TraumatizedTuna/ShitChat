const dicUrl = 'https://api.dictionaryapi.dev/api/v2/entries/en/';

let localDic = {};

async function getWordInfo(word) {
    const response = await fetch(dicUrl + word.toLowerCase());
    return new Word((await response.json())[0]);
}



let patterns = {
    greeting: [
        { key: 'partOfSpeech', eq: ['exclamation', 'interjection'] },
        { key: 'def', has: ['greeting'] }
    ]
}

function match(wordData) {
    const w = wordData.word;
    for (let key in patterns) {
        const p = patterns[key]
        if (p.every(c => wordData.meanings.some(m => c.eq?.includes(m[c.key]) || c.has?.some(e => m[c.key].includes(e))))) {
            localDic[key] ||= {};
            localDic[key][wordData.word] = wordData;
        }
    }
}


class Word {
    constructor(data) {
        this.word = data.word;
        this.meanings = data.meanings;
        this.meanings.forEach(m => m.def = m.definitions[0].definition.toLowerCase());
        this.pos = data.meanings.map(m => m.partOfSpeech);
    }
}

function reply(msg) {
    
}