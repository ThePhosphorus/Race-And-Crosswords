export const MIN_WORD_LENGTH: number = 2;

export enum Difficulty {
    Easy = 1,
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

    constructor(char?:string) {
        if(char !== undefined) {
            this.char = char;
        }
        this.isBlackTile = false;
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
