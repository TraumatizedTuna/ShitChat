const dicUrl = 'https://api.dictionaryapi.dev/api/v2/entries/en/';
async function getWordInfo(word) {
    const response = await fetch(dicUrl + word.toLowerCase());
    return new Word((await response.json())[0]);
}



let patterns = {
    greeting: [
        { key: 'partOfSpeech', eq: ['exclamation', 'interjection'] },
        { key: 'definitions._.definition', has: ['greeting'] }
    ]
}

function match(wordData) {
    for (let p of patterns) {
        if (p.all(wordData)) { }
    }
}


class Word {
    constructor(data) {
        this.word = data.word;
        this.meanings = data.meanings;
        this.partsOfSpeech = data.meanings.map(m => m.partOfSpeech);
    }
}