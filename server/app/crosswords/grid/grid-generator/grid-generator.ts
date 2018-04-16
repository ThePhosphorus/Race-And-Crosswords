import { Word } from "../../../../../common/crossword/word";
import { Difficulty } from "../../../../../common/crossword/enums-constants";
import { BaseGridGenerator } from "./base-grid-generator";

const MAX_TOTAL_ROLLBACKS: number = 20;

export class GridGenerator extends BaseGridGenerator {

    protected rollbackCount: number;

    protected getWordWeight(word: Word): number {
        let weight: number = 0;
        for (const letter of word.letters) {
            weight += letter.count;
        }

        return weight;
    }

    protected sortWords(): void {
        this.notPlacedWords = this.notPlacedWords.sort((w1: Word, w2: Word) => {
            const difference: number = this.getWordWeight(w1) - this.getWordWeight(w2);
            if (difference !== 0) {
                return difference;
            } else {
                return w1.letters.length - w2.letters.length;
            }
        });
    }

    protected async findWords(difficulty: Difficulty): Promise<void> {

        await this.findWord(this.notPlacedWords.pop(), difficulty);

        while (this.notPlacedWords.length > 0) {
            if (this.rollbackCount > MAX_TOTAL_ROLLBACKS) {
                this.initialiseEmptyGrid(this.crossword.size);
                this.rollbackCount = 0;
            }
            const word: Word = this.notPlacedWords.pop();
            if (! await this.findWord(word, difficulty)) {
                await this.backtrack(word, difficulty);
            }
            this.sortWords();
        }

    }

    protected async findWord(word: Word, difficulty: Difficulty): Promise<boolean> {
        const constraint: string = this.getConstraints(word);
        const isEasyWord: boolean = difficulty !== Difficulty.Hard;
        const newWord: string = await this.externalCommunications.getWordsFromServer(constraint, word, isEasyWord);

        // if (constraint.indexOf(CONSTRAINT_CHAR) === -1) {
        //     receivedWord = await this.externalCommunications.getDefinitionsFromServer(word.toString());
        // } else {
        //     receivedWord = await this.externalCommunications.getWordsFromServer(constraint, word, isEasyWord);
        // }

        return newWord ? this.crossword.addWord(newWord, word) : false;
    }

    protected async backtrack(currentWord: Word, difficulty: Difficulty): Promise<void> {
        let isFixed: boolean = false;
        while (!isFixed) {
            const removedWord: Word = this.backjump(currentWord);
            if (removedWord == null) {
                await this.findWord(currentWord, difficulty);
                isFixed = true;
            } else {
                const removedWordString: string = removedWord.toString();
                if (!await this.findWord(removedWord, difficulty)) {
                    this.notPlacedWords.push(removedWord);
                } else {
                    if (removedWord.toString() !== removedWordString && await this.findWord(currentWord, difficulty)) {
                        isFixed = true;
                    } else {
                        this.crossword.removeWord(this.crossword.words.indexOf(removedWord));
                        this.notPlacedWords.push(removedWord);
                    }
                }
            }
        }
    }

    protected backjump(currentWord: Word): Word {
        this.rollbackCount++;
        for (let i: number = this.crossword.words.length - 1; i >= 0; i--) {
            if (this.doesIntersect(this.crossword.words[i], currentWord)) {
                return this.crossword.removeWord(i);
            }
        }

        return null;

    }

}
