import * as http from "http";
import { IncomingMessage } from "https";
import { Words } from "./words";

const HTTP_STATUS_OK: number = 200;

export class Datamuse {
    public getWords(callback: (words: Words) => void): void {
        http.get("http://api.datamuse.com/words?sp=t??t", (res: IncomingMessage) => {
            const { statusCode } = res;
            const words: Words = new Words();

            if (statusCode === HTTP_STATUS_OK) {
                res.setEncoding("utf8");
                let rawData: string = "";

                res.on("data", (chunk: string | Buffer) => { rawData += chunk; });
                res.on("end", () => {
                    try {
                        words.words = JSON.parse(rawData);
                        callback(words);
                    } catch (e) {
                        callback(new Words());
                    }
                });
            } else {
                words.error = "HTTP error: " + statusCode;
                callback(words);
            }
        });
    }
}
