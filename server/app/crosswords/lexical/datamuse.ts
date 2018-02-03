import * as http from "http";
import { IncomingMessage } from "http";
import { Word } from "../../../../common/communication/word";

const HTTP_STATUS_OK: number = 200;
const HARD_THRESHOLD: number = 1000;

export class Datamuse {
    public getWords(constraint: string, callback: (words: Array<Word>) => void): void {
        http.get("http://api.datamuse.com/words?sp=" + constraint + "&md=def", (res: IncomingMessage) => {
            const { statusCode } = res;

            if (statusCode === HTTP_STATUS_OK) {
                res.setEncoding("utf8");
                let rawData: string = "";

                res.on("data", (chunk: string | Buffer) => { rawData += chunk; });
                res.on("end", () => {
                    try {
                        const parsedWords: Array<Word> = JSON.parse(rawData);
                        callback(parsedWords);
                    } catch (e) {
                        callback([]);
                    }
                });
            } else {
                callback([]);
            }
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
