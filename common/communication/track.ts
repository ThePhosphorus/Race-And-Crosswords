export class Track {
    constructor (
        public nom: string,
        public description: string,
        public points: Vector3Struct[]
    ){}
}

export class Vector3Struct {
    public constructor(
        public x: number,
        public y: number,
        public z: number
    ) {}
}