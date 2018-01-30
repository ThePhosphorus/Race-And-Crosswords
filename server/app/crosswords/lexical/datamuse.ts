import * as request from "request-promise-native";
import { Word } from "../../../../common/communication/word";

const HARD_THRESHOLD: number = 1000;

export class Datamuse {
    public getWords(constraint: string, callback: (words: Array<Word>) => void): void {
        request("http://api.datamuse.com/words?sp=" + constraint + "&md=def")
            .then((htmlString: string) => {
                const parsedWords: Array<Word> = JSON.parse(htmlString);
                callback(parsedWords);
            })
            .catch(() => {
                callback([]);
            });
    }

    public getEasyWord(constraint: string, callback: (word: Word) => void): void {
        this.getWords(constraint, (words: Array<Word>) => {
            words = words.filter((w: Word) => w.score > HARD_THRESHOLD);
            callback(words.length > 0 ? words[0] : null);
        });
    }

    public getHardWord(constraint: string, callback: (word: Word) => void): void {
        this.getWords(constraint, (words: Array<Word>) => {
            words = words.filter((w: Word) => w.score < HARD_THRESHOLD);
            callback(words.length > 0 ? words[0] : null);
        });
    }
}
