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
    constructor(char?:string) {
        if(char !== undefined) {
            this.char = char;
        }
        this.isBlackTile = false;
    }
    char: string;
    isBlackTile: boolean;
}

export class Word {
    constructor() {
        this.id = -1;
        this.letters = new Array<Letter>();
        this.definitions = new Array<string>();
    }

    public id: number;
    public letters: Letter[];
    public definitions: string[];
    public orientation: Orientation;
}

export class CrosswordGrid {
    constructor() {
        this.words = new Array<Word>();
        this.grid = new Array<Letter>();
        this.size = 0;
    }

    public words: Word[];
    public grid: Letter[];
    public size: number;
}
