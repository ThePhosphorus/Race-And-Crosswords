import { Difficulty } from './crossword-grid';

export class InWaitMatch {
    public constructor(
        public name: string,
        public difficulty: Difficulty
    ) {
    }
}
