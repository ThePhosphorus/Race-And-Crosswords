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
}

export class Word {
    public id: number;
    public letters: Letter[];
    public definitions: string[];
    public orientation: Orientation;
}

export class CrosswordGrid {
    public words: Word[];
    public grid: Letter[];
    public size: number;
}
