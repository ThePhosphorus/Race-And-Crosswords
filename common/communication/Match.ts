import { Difficulty } from "../crossword/enums-constants";

export class InWaitMatch {
    public constructor(
        public name: string,
        public difficulty: Difficulty
    ) {
    }
}
