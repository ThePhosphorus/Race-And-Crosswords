export class Player {
    public constructor (
        public id: number,
        public name: string,
        public score:number
        ) {}
}

export enum PlayerId {
    PLAYER1, PLAYER2
}
