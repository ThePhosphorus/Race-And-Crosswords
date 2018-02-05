import * as Request from "request-promise-native";
import { DatamuseWord } from "../../../../common/communication/datamuse-word";

export const HARD_THRESHOLD: number = 10000;

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

    public async getWord(constraint: string, isEasy: boolean): Promise<string> {
        let words: Array<DatamuseWord> = await this.makeRequest(constraint);
        words = words.filter((w: DatamuseWord) => isEasy ? w.score > HARD_THRESHOLD : w.score < HARD_THRESHOLD)
                     .filter((w: DatamuseWord) => w.defs !== undefined)
                     .filter((w: DatamuseWord) => w.word.indexOf(" ") === -1 && w.word.indexOf("-") === -1);
        const word: DatamuseWord = words[Math.floor(Math.random() * (words.length - 1))];

        return JSON.stringify(word);
    }
}
