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
    user: [new Pattern([{ key: 'word', eq: ['i', 'me', 'myself', 'my', 'mine'] }])],
    shitchat: [new Pattern([{ key: 'word', starts: ['you'], eq: ['thou', 'thee', 'thy', 'thyself', 'thine', 'ye'], has: ['shitchat', 'shit-chat'] }], .01)],
    bad: [new Pattern([{ key: 'word', has: ['fuck'] }])]
};

/*Generate pattterns for parts of speech.
Add pattern with all other parts of speech with uncertainty > 1 to increase uncertainty for homonyms with different parts of speech.*/ 
['noun', 'verb', 'adjective', 'adverb', 'interjection', 'exclamation'].forEach(
    (pos, i, poss) => patternLists[pos] = [
        new Pattern([{ key: 'partOfSpeech', eq: [pos] }], 0.1),
        new Pattern([{ key: 'partOfSpeech', eq: [poss.filter(p => p !== pos)] }], 4)
    ]
)