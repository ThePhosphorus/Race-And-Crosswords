export const MIN_WORD_LENGTH: number = 2;

export enum Difficulty {
    Easy= "Easy",
    Medium= "Medium",
    Hard= "Hard",
}


export class Position {
    public constructor(public column: number, public row: number) {}
}

export enum Orientation {
    Vertical = "Vertical",
    Horizontal = "Horizontal",
}

export class Word {

    private _wordString: string;
    private _definitions: string[];
    
    public constructor(private _orientation: Orientation, private _position: Position, private _length: number) {
        this._wordString = "";
    }

    public get position(): Position {
        return this._position;
    }

    public get orientation(): Orientation {
        return this._orientation;
    }

    public get definitions(): string[] {
        return this._definitions;
    }

    public addDefinitions(definitions: string[] ): void {
        definitions.forEach((definition: string) => {
           this._definitions.push(definition);
        });
    }

    public set wordString(word: string) {
        this._wordString = word;
    }

    public get wordString(): string {
        return this._wordString;
    }

    public get length(): number {
        return this._length;
    }
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
