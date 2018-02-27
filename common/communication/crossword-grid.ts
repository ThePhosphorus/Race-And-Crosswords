export const MIN_WORD_LENGTH: number = 2;

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
    count: number =0;
    id: number;

    constructor(char?:string, id?:number) {
        if(char !== undefined) {
            this.char = char;
        }
        if(id !== undefined) {
            this.id = id;
        }
        this.isBlackTile = false;
    }
}

export class Word {
    public id: number;
    public letters: Letter[];
    public definitions: string[];
    public orientation: Orientation;
    public rollbackCount: number = 0 ;

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
