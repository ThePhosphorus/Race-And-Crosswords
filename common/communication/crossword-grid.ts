export const MIN_WORD_LENGTH: number = 2;

export enum Difficulty {
    Easy = 1,
    Medium,
    Hard,
}


export class Position {
    public constructor(public column: number, public row: number) {}
}

export enum Orientation {
    Vertical = "Vertical",
    Horizontal = "Horizontal",
}

export class Word {
    public constructor(_orientation?: Orientation, _position?: Position, _length?: number) {
    }

    wordString: string;
    definitions: string[];
    orientation: Orientation;
    position: Position;
    length: number;
}

export class CrosswordGrid {
    public blackTiles: Position[];
    public across: Word[][];
    public down: Word[][];

    public constructor(gridSize: number){
        this.down = new Array<Word[]>();
        this.across = new Array<Word[]>();
        for (let i: number = 0; i < gridSize; i++) {
            this.down.push(new Array<Word>());
            this.across.push(new Array<Word>());
        }
        this.blackTiles = new Array<Position>();
    }
}
