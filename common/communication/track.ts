export class Track {
    constructor (
        public _id: string,
        public name: string,
        public description: string,
        public points: Vector3Struct[]
    ){}
}

export class Vector3Struct {
    constructor (
        public x: number,
        public y: number,
        public z: number
    ){}
}