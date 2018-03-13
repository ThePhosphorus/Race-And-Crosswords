export const MIN_WORD_LENGTH: number = 3;

export enum Difficulty {
    Easy,
    Medium,
    Hard,
}

export enum Orientation {
    Across = "Across",
    Down = "Down",
}

export class Letter {
    char: string;
    isBlackTile: boolean;
    count: number;
    id: number;

    constructor(char?:string, id?:number) {
        this.char = char?char:"";
        this.id = id?id:-1;
        this.isBlackTile = false;
        this.count = 0;
    }
}

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

export class CrosswordGrid {
    public words: Word[];
    public grid: Letter[];
    public size: number;

    constructor() {
        this.words = new Array<Word>();
        this.grid = new Array<Letter>();
        this.size = 0;
    }
}
