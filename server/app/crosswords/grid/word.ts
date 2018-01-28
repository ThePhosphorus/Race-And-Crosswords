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
}
