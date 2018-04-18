import { Highscore } from "./highscore";
import { Vector3Struct } from "./vector3-struct";

export class Track {
    public constructor (
        public _id: string,
        public name: string,
        public description: string,
        public points: Vector3Struct[],
        public nbPlayed: number,
        public highscores?: Array<Highscore>
    ) {}
}
