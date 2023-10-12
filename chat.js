const dicUrl = 'https://api.dictionaryapi.dev/api/v2/entries/en/';
async function getWordInfo(word){
    const response = await fetch(dicUrl + word.toLowerCase());
    const data = await response.json(); 
    return data; 
}

class Word{
    constructor(word, pos){

    }
}

let patterns ={
    greeting: [
        {key: 'partOfSpeech', eq: ['exclamation']},
        {key: 'definitions._.definition', has:  }
    ]
}