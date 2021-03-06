import * as Request from "request-promise-native";
import { DatamuseWord} from "../../../../common/communication/datamuse-word";

const HALF: number = 0.5;

export class Datamuse {
    public async makeRequest(constraint: string): Promise<Array<DatamuseWord>> {
        const htmlString: string = await Request("http://api.datamuse.com/words?sp=" + constraint + "&md=d").promise();

        return JSON.parse(htmlString) as Array<DatamuseWord>;
    }

    public async getWord(constraint: string, isEasy: boolean): Promise<string> {
        const words: Array<string> = await this.getWords(constraint, isEasy);

        const word: string = words[Math.floor(Math.random() * (words.length - 1))];
        if (word == null) { return undefined; }

        return word;
    }

    public async getWords(constraint: string, isEasy?: boolean): Promise<string[]> {
        let words: Array<DatamuseWord> = await this.makeRequest(constraint);
        words = words.filter((w: DatamuseWord) => this.isValidWord(w));
        if (isEasy !== undefined) {
            words = this.selectWordsFromDifficulty(words, isEasy);
        }

        return words.map((dmWord: DatamuseWord) => dmWord.word);
    }

    private selectWordsFromDifficulty(words: Array<DatamuseWord>, isEasy: boolean): Array<DatamuseWord> {
        words.sort((a: DatamuseWord, b: DatamuseWord) => b.score - a.score);

        return isEasy ? words.slice(0, Math.floor(words.length * HALF)) : words.slice(Math.floor(words.length * HALF), words.length);
    }

    private isValidWord(word: DatamuseWord): boolean {
        return  this.testHasDefinitions(word) &&
                this.testRemoveDefsWithWord(word) &&
                this.testHasDefinitions(word) &&
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

    private testHasDefinitions(word: DatamuseWord): boolean {
        return word.defs != null && word.defs.length > 0;
    }

    private testDontContainBadChar(word: DatamuseWord): boolean {
        return word.word.indexOf(" ") === -1 && word.word.indexOf("-") === -1;
    }

    public async getDefinitions(word: string): Promise<string[]> {
        const datamuseWords: Array<DatamuseWord> = await this.makeRequest(word);

        if (datamuseWords !== undefined) {
            const dmWord: DatamuseWord = datamuseWords[0];
            if (dmWord != null &&
                dmWord.word === word &&
                this.isValidWord(dmWord)) {
                    return dmWord.defs;
                }
        }

        return null;
    }
}
