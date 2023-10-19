class Word {
    constructor(data) {
        this.word = data.word;
        this.meanings = data.meanings || [{definitions:[{definition:''}]}];
        this.meanings.forEach(m => { m.def = m.definitions[0].definition.toLowerCase(); m.word = this.word; });
        this.pos = this.meanings.map(m => m.partOfSpeech);
        this.patterns = {};
    }
}

class Pattern {
    constructor(conditions, uncert = 0, check = this.check) {
        this.conditions = conditions;
        this.uncert = uncert;
        this.check = check;
    }
    check(wordData) {
        //If some definition matches every condition
        if (this.conditions.every(c =>
            wordData.meanings.some(m =>
                c.eq?.includes(m[c.key]) ||
                c.starts?.some(e => m[c.key].substr(0, e.length) === e) ||
                c.has?.some(e => m[c.key].includes(e))
            )
        )) {
            return this.uncert;
        }
        return 1;
    }
}