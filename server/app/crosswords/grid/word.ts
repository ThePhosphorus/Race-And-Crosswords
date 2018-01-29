export enum Orientation {
    Vertical = "Vertical",
    Horizontal = "Horizontal",
}

export class Position {
    public column: number;
    public row: number;
}

export class Word {

    public position: Position;
    public wordString: string;
    public definitions: string[];
    public orientation: Orientation;

    public Word(orientation: Orientation, position: Position, length: number): void {
        this.orientation = orientation;
        this.position = position;
        for (let i: number = 0; i < length ; i++) {
            this.wordString += "?";
        }
    }

    public setWord(word: string): void {
        this.wordString = word;
    }

    public getWord(): string {
        return this.wordString;
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
