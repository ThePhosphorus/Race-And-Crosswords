export class Track {
    constructor (
        public _id: string,
        public name: string,
        public description: string,
        public points: Vector3Struct[]
    ){}
}

export interface Vector3Struct {
    x: number;
    y: number;
    z: number;
}