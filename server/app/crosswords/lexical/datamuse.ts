import * as request from "request-promise-native";
import { Word } from "../../../../common/communication/word";

const HARD_THRESHOLD: number = 1000;

export class Datamuse {
    public makeRequest(constraint: string, callback: (words: Array<Word>) => void): void {
        request("http://api.datamuse.com/words?sp=" + constraint + "&md=def")
            .then((htmlString: string) => {
                const parsedWords: Array<Word> = JSON.parse(htmlString);
                callback(parsedWords);
            })
            .catch(() => {
                callback([]);
            });
    }

    public getWord(constraint: string,  isEasy: boolean, callback: (word: Word) => void): void {
        if(isEasy)
        {
            this.makeRequest(constraint, (words: Array<Word>) =>
            {
                words = words.filter((w: Word) => w.score > HARD_THRESHOLD);
                callback(words.length > 0 ? words[0] : null);
            });
        } else {
            this.makeRequest(constraint, (words: Array<Word>) => {
                words = words.filter((w: Word) => w.score <= HARD_THRESHOLD);
                callback(words.length > 0 ? words[0] : null);
            });
        }
    }
}
