export class Position {
    public constructor(public column: number, public row: number) {}
}

export enum Orientation {
    Vertical = "Vertical",
    Horizontal = "Horizontal",
}

export class Word {

    private position: Position;
    private wordString: string;
    private definitions: string[];
    private orientation: Orientation;

    public constructor(orientation: Orientation, position: Position, length: number) {
        this.orientation = orientation;
        this.position = position;
        for (let i: number = 0; i < length ; i++) {
            this.wordString += "?";
        }
    }

    public getPosition(): Position {
        return this.position;
    }

    public getOrientation(): Orientation {
        return this.orientation;
    }

    public getDefinitions(): string[] {
        return this.definitions;
    }

    public addDefinitions(definitions: string[] ): void {
        definitions.forEach((definition: string) => {
           this.definitions.push(definition);
        });
    }

    public setWord(word: string): void {
        this.wordString = word;
    }

    public getWord(): string {
        return this.wordString;
    }

    public get length(): number {
        return length;
    }

    public set length(length: number) {
        this.length = length;
    }

    public addLetterConstraint(position: number, letter: string): boolean {
        if (letter.length !== 1) {
            return false;
        }
        let tempString: string;

        for (let i: number = 0; i < position ; i++) {
            tempString += this.wordString[i];
        }

        tempString += letter;

        for (let i: number = position + 1; i < this.wordString.length ; i++) {
            tempString += this.wordString[i];
        }

        this.wordString = tempString;

        return true;

    }

}

export class CrosswordGrid {
    public blackTiles: Position[];
    public across: Word[][];
    public down: Word[][];
}
