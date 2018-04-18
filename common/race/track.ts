import { Highscore } from "./highscore";
import { Vector3Struct } from "./vector3-struct";

export class Track {
    public constructor (
        public _id: string, // le nom de la variable doit être _id, car on utilise le _id de mongoDb.
        public name: string,
        public description: string,
        public points: Vector3Struct[],
        public nbPlayed: number,
        public highscores?: Array<Highscore>
    ) {}
}
