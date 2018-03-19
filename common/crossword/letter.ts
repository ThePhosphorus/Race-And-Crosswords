export class Letter {
    char: string;
    isBlackTile: boolean;
    count: number;
    id: number;

    constructor(char?:string, id?:number) {
        this.char = char?char:"";
        this.id = id?id:-1;
        this.isBlackTile = false;
        this.count = 0;
    }
}