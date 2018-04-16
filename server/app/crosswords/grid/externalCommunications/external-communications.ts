import * as Request from "request-promise-native";
import { LEXICAL_SERVICE_URL } from "../../../constants";

const LEXICAL_REQUEST_WORDS: string = "query-word/";
const LEXICAL_TEST_WORD: string = "query-definitions/";

export class ExternalCommunications {
    public async getWordsFromServer(constraint: string, isEasyWord: boolean): Promise<string> {
        const options: Request.RequestPromiseOptions = {
            method: "POST",
            body: {
                constraint: constraint,
                easy: isEasyWord
            },
            json: true
        };

        return Request(LEXICAL_SERVICE_URL + LEXICAL_REQUEST_WORDS, options) ;
    }

    public async getDefinitionsFromServer(word: string): Promise<string[]> {
        const options: Request.RequestPromiseOptions = {
            method: "POST",
            body: {
                word: word
            },
            json: true
        };

        return Request(LEXICAL_SERVICE_URL + LEXICAL_TEST_WORD, options);
    }

}
