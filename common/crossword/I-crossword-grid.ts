import { Word } from "./word";
import { Letter } from "./letter";

export interface ICrosswordGrid {
    words: Word[];
    grid: Letter[];
    size: number;
}
