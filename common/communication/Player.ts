export class Player {
    public wantsRematch: boolean;
    public constructor (
        public id: number,
        public name: string,
        public score:number
        ) {
            this.wantsRematch = false;
        }
}
