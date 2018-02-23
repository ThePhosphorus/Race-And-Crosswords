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
    public char: string;
    public isBlackTile: boolean;
    public count: number;
    public id: number;

    constructor(char?:string, id?:number) {
        if(char != null) {
            this.char = char;
        }
        if(id != null) {
            this.id = id;
        }
        this.isBlackTile = false;
        this.count =0;
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

    constructor(words?: Word[], grid?: Letter[], size?: number) {
        this.words = words ? words : new Array<Word>();
        this.grid = grid ? grid : new Array<Letter>();
        this.size = size ? size : 0;
    }
}

// We can't copy Javascript objects (that we get from JSON requests ) to objects with methods.
// So the following classes are used for the cloning the classes above.

export class ClonableLetter extends Letter {
    public constructor(letter: Letter) {
        super(letter.char,letter.id);
        this.count = letter.count;
        this.isBlackTile = letter.isBlackTile;
    }

    public clone(): Letter {
        const clone: Letter = new Letter(this.char,this.id);
        clone.count = this.count;
        clone.isBlackTile = this.isBlackTile;

        return clone;
    }
}

export class ClonableWord extends Word {
    public constructor (word: Word) {
        super();
        this.definitions = word.definitions;
        this.id = word.id;
        this.letters = word.letters;
        this.orientation = word.orientation;
        this.rollbackCount = word.rollbackCount;
    }

    public clone(letters?: Letter[]): Word {
        const newLetters: Array<Letter> = new Array<Letter>();
        this.letters.forEach((elem: Letter) => 
            newLetters.push(new ClonableLetter(letters.find((l: Letter) => l.id == elem.id)).clone()) 
        );

        const definitions: Array<string> = new Array<string>();
        this.definitions.forEach((elem: string) => definitions.push(elem));

        const clone: Word = new Word();
        clone.id = this.id;
        clone.letters = newLetters;
        clone.definitions = definitions;
        clone.orientation = this.orientation;
        clone.rollbackCount = this.rollbackCount;

        return clone;
    }
}

export class ClonableCrosswordGrid extends CrosswordGrid {
    public constructor(grid: CrosswordGrid) {
        super(grid.words,grid.grid,grid.size);
    }

    public clone() : CrosswordGrid {
        const grid: Array<Letter> = new Array<Letter>();
        this.grid.forEach((elem: Letter) => grid.push(new ClonableLetter(elem).clone()));

        const words: Array<Word> = new Array<Word>();
        this.words.forEach((elem: Word) => words.push(new ClonableWord(elem).clone(grid)));

        return new CrosswordGrid(words,grid,this.size);
    }
}