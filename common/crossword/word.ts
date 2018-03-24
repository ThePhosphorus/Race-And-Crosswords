import { Letter } from "./letter";
import { Orientation } from "./enums-constants";


export class Word {
    public id: number;
    public letters: Letter[];
    public definitions: string[];
    public orientation: Orientation;

    constructor() {
        this.id = -1;
        this.letters = new Array<Letter>();
        this.definitions = new Array<string>();
        this.orientation = null;
    }

    public toString(): string {
        let wordString: string = "";
        this.letters.forEach((letter: Letter) => {
            wordString += letter.char;
        });

        return wordString;
    }
}