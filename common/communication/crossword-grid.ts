export class Position {
    public constructor(public column: number, public row: number) {}
}

export enum Orientation {
    Vertical = "Vertical",
    Horizontal = "Horizontal",
}

export class Word {

    private _position: Position;
    private _wordString: string;
    private _definitions: string[];
    private _orientation: Orientation;
    private _length: number;

    public constructor(orientation: Orientation, position: Position, length: number) {
        this._orientation = orientation;
        this._position = position;
        for (let i: number = 0; i < length ; i++) {
            this._wordString += "?";
        }
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

    public get word(): string {
        return this._wordString;
    }

    public get length(): number {
        return this._length;
    }

    public addLetterConstraint(position: number, letter: string): boolean {
        if (letter.length !== 1) {
            return false;
        }
        let tempString: string;

        for (let i: number = 0; i < position ; i++) {
            tempString += this._wordString[i];
        }

        tempString += letter;

        for (let i: number = position + 1; i < this._wordString.length ; i++) {
            tempString += this._wordString[i];
        }

        this._wordString = tempString;

        return true;

    }

}

export class CrosswordGrid {
    public blackTiles: Position[];
    public across: Word[][];
    public down: Word[][];
}
