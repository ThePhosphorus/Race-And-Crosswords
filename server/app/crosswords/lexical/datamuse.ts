import * as Request from "request-promise-native";
import { DatamuseWord } from "../../../../common/communication/datamuse-word";

export const HARD_THRESHOLD: number = 1000;

export class Datamuse {
    public async makeRequest(constraint: string): Promise<Array<DatamuseWord>> {
        const htmlString: string = await Request("http://api.datamuse.com/words?sp=" + constraint + "&md=d");

        return JSON.parse(htmlString) as Array<DatamuseWord>;
    }

    public async getWord(constraint: string, isEasy: boolean): Promise<string> {
        let words: Array<DatamuseWord> = await this.makeRequest(constraint);
        words = words.filter((w: DatamuseWord) => isEasy ? w.score > HARD_THRESHOLD : w.score < HARD_THRESHOLD)
                     .filter((w: DatamuseWord) => w.defs !== undefined)
                     .filter((w: DatamuseWord) => w.word.indexOf(" ") === -1 && w.word.indexOf("-") === -1);
        const word: DatamuseWord = words[Math.floor(Math.random() * (words.length - 1))];
        if (word == null) { return undefined; }

        const defIndex: number = this.definitionContainesWord(word);
        if ( defIndex !== -1) {
            word.defs.splice(defIndex, 1);
        }

        return JSON.stringify(word);
    }

    private definitionContainesWord(word: DatamuseWord): number {
        for (let i: number = 0; i < word.defs.length; i++) {
            if (word.defs[i].indexOf(word.word) !== -1 ) {
                return i;
            }
        }

        return -1;
    }

    public async getDefinitions(word: string): Promise<string> {
        const datamuseWords: Array<DatamuseWord> = await this.makeRequest(word);

        if (datamuseWords !== undefined) {
            for (const datamuseWord of datamuseWords) {
                if (datamuseWord.word === word) {
                    return JSON.stringify(datamuseWord);
                }
            }
        }

        return undefined;
    }
}
