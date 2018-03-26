export class Player {
    
    public constructor (
        public id: number,
        public name: string,
        public score:number,
        public wantsRematch: boolean = false
        ) {}
}
