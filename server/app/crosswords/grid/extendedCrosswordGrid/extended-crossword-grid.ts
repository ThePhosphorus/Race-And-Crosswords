import { CrosswordGrid, Word, Orientation, MIN_WORD_LENGTH, Letter } from "../../../../../common/communication/crossword-grid";

export class ExtendedCrosswordGrid extends CrosswordGrid {
    public getRow(position: number): number {
        return Math.floor( position / this.size);
    }

    public getColumn(position: number): number {
        return position % this.size;
    }

    public getPosition(row: number, column: number): number {
        return row * this.size + column;
    }

    public findWords(): Word[] {
        const unPlacedWords: Word[] = new Array<Word>();
        let acrossWord: Word = new Word();
        let downWord: Word = new Word();
        for (let i: number = 0; i < this.size; i++) {
            for (let j: number = 0; j < this.size; j++) {
                acrossWord = this.initializeLetter(acrossWord, this.getPosition(i, j), Orientation.Across, unPlacedWords);
                downWord = this.initializeLetter(downWord, this.getPosition(j, i), Orientation.Down, unPlacedWords);
            }
            this.addWord(acrossWord, Orientation.Across, unPlacedWords);
            this.addWord(downWord, Orientation.Down, unPlacedWords);
            acrossWord = new Word();
            downWord = new Word();
        }

        return unPlacedWords.reverse();
    }

    private initializeLetter(word: Word, tilePosition: number, orientation: Orientation, wordList: Word[]): Word {
        if (!this.grid[tilePosition].isBlackTile) {
            if (word.letters.length === 0) {
                word.id = tilePosition;
            }
            word.letters.push(this.grid[tilePosition]);
        } else { // IF BLACK TILE
            this.addWord(word, orientation, wordList);
            word = new Word();
        }

        return word;
    }

    private addWord(word: Word, orientation: Orientation, wordList: Word[]): void {
        if (word.letters.length >= MIN_WORD_LENGTH) {
            word.orientation = orientation;
            wordList.push(word);
        }
    }

    public displayGrid(): void {
        // Used for debugging and test purposes
        let s: string = "";
        for (let i: number = 0; i < this.size; i++) {
            for (let j: number = 0; j < this.size; j++) {
                const l: Letter = this.grid[(this.size * i) + j];
                s += l.char !== "" ? l.char : (l.isBlackTile ? "#" : "-");
            }
            s += "\n";
        }
        console.log(s);

    }

}
