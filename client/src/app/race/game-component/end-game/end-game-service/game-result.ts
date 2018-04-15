export class GameResult {
    public constructor(public name: string,
                       public isAi: boolean,
                       public times: Array<string>,
                       public total: string
    ) {}
}
