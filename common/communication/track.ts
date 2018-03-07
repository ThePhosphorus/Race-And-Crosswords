export class Track {
    constructor (
        public _id: string,
        public name: string,
        public description: string,
        public points: Vector3Struct[],
        public nbPlayed: number
    ){}
}

export interface Vector3Struct {
    x: number;
    y: number;
    z: number;
}