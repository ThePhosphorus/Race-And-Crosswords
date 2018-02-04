import * as Request from "request-promise-native";

const HARD_THRESHOLD: number = 1000;

interface DatamuseWord {
    word: string;
    score: number;
    defs: string[];
}

export class Datamuse {
    public async makeRequest(constraint: string): Promise<Array<DatamuseWord>> {
        const htmlString: string = await Request("http://api.datamuse.com/words?sp=" + constraint + "&md=d");

        return JSON.parse(htmlString) as Array<DatamuseWord>;
    }

    public async getWords(constraint: string, isEasy: boolean): Promise<string> {
        let words: Array<DatamuseWord> = await this.makeRequest(constraint);
        words = words.filter((w: DatamuseWord) => isEasy ? w.score > HARD_THRESHOLD : w.score < HARD_THRESHOLD)
                     .filter((w: DatamuseWord) => w.defs !== undefined);

        return JSON.stringify(words);
    }
}
