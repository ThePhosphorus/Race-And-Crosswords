export class Letter {
    char: string;
    isBlackTile: boolean;
    count: number;
    id: number;

    constructor(char?:string, id?:number) {
        if(char !== undefined) {
            this.char = char;
        }
        if(id !== undefined) {
            this.id = id;
        }
        this.isBlackTile = false;
        this.count = 0;
    }
}
