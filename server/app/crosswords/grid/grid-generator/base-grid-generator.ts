import { ExternalCommunications } from "../externalCommunications/external-communications";
import { EmptyGridGenerator } from "../empty-grid-generator/empty-grid-generator";
import { Word } from "../../../../../common/crossword/word";
import { Difficulty, Orientation, MIN_WORD_LENGTH } from "../../../../../common/crossword/enums-constants";
import { Letter } from "../../../../../common/crossword/letter";
import { CrosswordGrid } from "../../../../../common/crossword/crossword-grid";
import { SCrosswordGrid } from "../scrossword-grid/scrossword-grid";
import { DatamuseWord } from "../../../../../common/communication/datamuse-word";

export const CONSTRAINT_CHAR: string = "?";

export abstract class BaseGridGenerator {

    protected externalCommunications: ExternalCommunications;
    protected emptyGridGenerator: EmptyGridGenerator;
    protected crossword: SCrosswordGrid;
    protected notPlacedWords: Word[];

    public constructor() {
        this.externalCommunications = new ExternalCommunications();
    }

    public async getNewGrid(difficulty: Difficulty, size: number): Promise<CrosswordGrid> {
        this.emptyGridGenerator = new EmptyGridGenerator();
        this.initialiseEmptyGrid(size);
        await this.findWords(difficulty);
        await this.addDefinitions(difficulty);
        this.crossword.cleanGrid();

        return this.crossword;
    }

    protected abstract findWords(difficulty: Difficulty): Promise<void>;

    protected initialiseEmptyGrid(size: number): void {

        this.crossword = this.emptyGridGenerator.getNewGrid();
        this.crossword.words = new Array<Word>();
        this.notPlacedWords = this.findEmptyWords();
    }

    protected findEmptyWords(): Word[] {
        const notPlacedWords: Word[] = new Array<Word>();
        let acrossWord: Word = new Word();
        let downWord: Word = new Word();
        for (let i: number = 0; i < this.crossword.size; i++) {
            for (let j: number = 0; j < this.crossword.size; j++) {
                acrossWord = this.addEmptyLetter(acrossWord, this.crossword.getPosition(i, j), Orientation.Across, notPlacedWords);
                downWord = this.addEmptyLetter(downWord, this.crossword.getPosition(j, i), Orientation.Down, notPlacedWords);
            }
            this.addEmptyWord(acrossWord, Orientation.Across, notPlacedWords);
            this.addEmptyWord(downWord, Orientation.Down, notPlacedWords);
            acrossWord = new Word();
            downWord = new Word();
        }

        return notPlacedWords.reverse();
    }

    private addEmptyLetter(word: Word, tilePosition: number, orientation: Orientation, wordList: Word[]): Word {
        if (!this.crossword.grid[tilePosition].isBlackTile) {
            if (word.letters.length === 0) {
                word.id = tilePosition;
            }
            word.letters.push(this.crossword.grid[tilePosition]);
        } else { // IF BLACK TILE
            this.addEmptyWord(word, orientation, wordList);
            word = new Word();
        }

        return word;
    }

    private addEmptyWord(word: Word, orientation: Orientation, wordList: Word[]): void {
        if (word.letters.length >= MIN_WORD_LENGTH) {
            word.orientation = orientation;
            wordList.push(word);
        }
    }

    protected doesIntersect(word1: Word, word2: Word): boolean {

        if (word1.orientation === word2.orientation) {
            return false;
        }

        const acrossWord: Word = word1.orientation === Orientation.Across ? word1 : word2;
        const downWord: Word = word1.orientation === Orientation.Down ? word1 : word2;

        const column: number = this.crossword.getColumn(downWord.id);
        const row: number = this.crossword.getRow(acrossWord.id);

        if (this.crossword.getColumn(acrossWord.letters[0].id) > column ||
            this.crossword.getColumn(acrossWord.letters[acrossWord.letters.length - 1].id) < column ||
            this.crossword.getRow(downWord.letters[0].id) > row ||
            this.crossword.getRow(downWord.letters[downWord.letters.length - 1].id) < row) {
            return false;
        }

        return true;
    }

    protected getConstraints(word: Word): string {
        let constraint: string = "";
        word.letters.forEach((letter: Letter) => {
            constraint += (letter.char === "") ? CONSTRAINT_CHAR : letter.char;
        });

        return constraint;
    }

    protected async addDefinitions(difficulty: Difficulty): Promise<void> {
        for (const word of this.crossword.words) {
            const datamuseWord: DatamuseWord = await this.externalCommunications.getDefinitionsFromServer(word.toString());
            this.crossword.setDefinition(datamuseWord.defs, word, difficulty);
        }

    }

}
