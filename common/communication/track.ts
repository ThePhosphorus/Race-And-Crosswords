export class Track {
    public constructor (
        public _id: string,
        public name: string,
        public description: string,
        public points: Vector3Struct[],
        public nbPlayed: number,
        public highscores?: Array<Highscore>
    ){}
}

export class Highscore {
    public constructor (
        public name: string,
        public time: number
    ) {}
}

export class Vector3Struct {
    public constructor (
        public x: number,
        public y: number,
        public z: number
    ){}
}