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
        words = words.filter((w: DatamuseWord) => this.isValidWord(w, isEasy));

        const word: DatamuseWord = words[Math.floor(Math.random() * (words.length - 1))];
        if (word == null) { return undefined; }

        return JSON.stringify(word);
    }

    private isValidWord(word: DatamuseWord, isEasy: boolean): boolean {
        return this.testDifficulty(word, isEasy) &&
                this.testHasDefinitions(word) &&
                this.testRemoveDefsWithWord(word) &&
                this.testDontContainBadChar(word);
    }

    private testRemoveDefsWithWord(word: DatamuseWord): boolean {
        word.defs.forEach((def: string, index: number) => {
            const foundIndex: number = def.toLowerCase().indexOf(word.word.toLowerCase());
            if (foundIndex !== -1) {
                word.defs.splice(index, 1);
            }
        });

        return word.defs.length > 0;
    }

    private testDifficulty(word: DatamuseWord, isEasy: boolean): boolean {
        return isEasy ? word.score > HARD_THRESHOLD : word.score < HARD_THRESHOLD;
    }

    private testHasDefinitions(word: DatamuseWord): boolean {
        return word.defs != null && word.defs.length > 1;
    }

    private testDontContainBadChar(word: DatamuseWord): boolean {
        return word.word.indexOf(" ") === -1 && word.word.indexOf("-") === -1;
    }

    public async getDefinitions(word: string): Promise<string> {
        const datamuseWords: Array<DatamuseWord> = await this.makeRequest(word);

        if (datamuseWords !== undefined) {
            const dmWord: DatamuseWord = datamuseWords[0];
            if (dmWord != null &&
                dmWord.word === word &&
                this.testHasDefinitions(dmWord) &&
                this.testRemoveDefsWithWord(dmWord)) {
                    return JSON.stringify(dmWord);
                }
        }

        return undefined;
    }
}
