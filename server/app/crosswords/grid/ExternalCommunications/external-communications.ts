import { Word } from "../../../../../common/communication/crossword-grid";
import { DatamuseWord } from "../../../../../common/communication/datamuse-word";
import * as Request from "request-promise-native";
import { LEXICAL_SERVICE_URL } from "../../../constants";

const LEXICAL_REQUEST_WORDS: string = "/query-word";
const LEXICAL_TEST_WORD: string = "/query-definitions";

export class ExternalCommunications {
    public async getWordsFromServer(constraint: string, word: Word, isEasyWord: boolean): Promise<DatamuseWord> {
        const options: Request.RequestPromiseOptions = {
            method: "POST",
            body: {
                constraint: constraint,
                easy: isEasyWord
            },
            json: true
        };

        return await Request(LEXICAL_SERVICE_URL + LEXICAL_REQUEST_WORDS, options) as DatamuseWord;
    }

    public async getDefinitionsFromServer(word: string): Promise<DatamuseWord> {
        const options: Request.RequestPromiseOptions = {
            method: "POST",
            body: {
                word: word
            },
            json: true
        };

        return await Request(LEXICAL_SERVICE_URL + LEXICAL_TEST_WORD, options) as DatamuseWord;
    }

}
