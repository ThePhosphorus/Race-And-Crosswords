import { CrosswordGrid } from "../../../../../common/crossword/crossword-grid";
import { Word } from "../../../../../common/crossword/word";
import { Difficulty } from "../../../../../common/crossword/enums-constants";
import { Letter } from "../../../../../common/crossword/letter";

export class SCrosswordGrid extends CrosswordGrid {

    public getRow(position: number): number {
        return Math.floor( position / this.size);
    }

    public getColumn(position: number): number {
        return position % this.size;
    }

    public getPosition(row: number, column: number): number {
        return row * this.size + column;
    }

    public addWord(newWord: string, word: Word): boolean {
        if (this.isUnique(newWord)) {
            this.setWord(newWord, word);

            return true;
        }

        return false;
    }

    public removeWord(index: number): Word {
        const word: Word = this.words[index];
        if (word == null) {
            return null;
        }

        for (const letter of word.letters) {
            if ((--letter.count) <= 0) {
                letter.char = "";
            }
        }
        word.definitions = new Array<string>();
        this.words.splice(index, 1);

        return word;

    }

    public cleanGrid(): void {
        for (const tile of this.grid) {
            if (tile.char === "") {
                tile.isBlackTile = true;
            } else {
                tile.char = tile.char.normalize("NFD")[0];
            }
        }
    }

    private isUnique(word: string): boolean {
        for (const w of this.words) {
            if (w.toString() === word) {
                return false;
            }
        }

        return true;
    }
    private setWord(receivedWord: string, gridWord: Word): void {
        for (let i: number = 0; i < gridWord.letters.length; i++) {
            gridWord.letters[i].char = (gridWord.letters[i].char === "") ? receivedWord[i] : gridWord.letters[i].char;
            gridWord.letters[i].count++;
        }

        this.words.push(gridWord);
    }

    public setDefinition(receivedDefs: string[], gridWord: Word, difficulty: Difficulty): void {
        if (receivedDefs.length === 1 || difficulty === Difficulty.Easy) {
            gridWord.definitions.push(receivedDefs[0]);
        } else {
            gridWord.definitions.push(receivedDefs[1]);
        }
    }

    public toString(): string {
        let str: string = "";

        this.grid.forEach((letter: Letter, index: number) => {
            if (index % this.size === 0 ) {
                str += "\n";
            }
            str += (letter.isBlackTile) ? "#" : (letter.char === "") ? "-" : letter.char;
        });

        return str;
    }

}
