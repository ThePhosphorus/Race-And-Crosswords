import { GridState } from "./grid-state";
import { Orientation } from "../../../../../common/crossword/enums-constants";
// tslint:disable:no-magic-numbers

describe("GridState", () => {
    let gridState: GridState;
    beforeEach(() => {
        gridState = new GridState();
    });

    it("should create", () => {
        expect(gridState).toBeDefined();
    });

    it("should return if a letter is disabled", () => {
        gridState.disabledLetters = [ 0, 1, 2, 3, 4];

        gridState.disabledLetters.forEach((letterId: number) => {
            expect(gridState.isLetterDisabled(letterId)).toBeTruthy();
        });

        expect(gridState.isLetterDisabled(-1)).toBeFalsy();
        expect(gridState.isLetterDisabled(5)).toBeFalsy();
        expect(gridState.isLetterDisabled(100)).toBeFalsy();
    });

    it("should return if a letter is selected", () => {
        gridState.selectedLetters = [ 0, 1, 2, 3, 4];

        gridState.selectedLetters.forEach((letterId: number) => {
            expect(gridState.isLetterSelected(letterId)).toBeTruthy();
        });

        expect(gridState.isLetterSelected(-1)).toBeFalsy();
        expect(gridState.isLetterSelected(5)).toBeFalsy();
        expect(gridState.isLetterSelected(100)).toBeFalsy();
    });

    it("should return if a letter is hovered", () => {
        gridState.hoveredLetters = [ 0, 1, 2, 3, 4];

        gridState.hoveredLetters.forEach((letterId: number) => {
            expect(gridState.isLetterHovered(letterId)).toBeTruthy();
        });

        expect(gridState.isLetterHovered(-1)).toBeFalsy();
        expect(gridState.isLetterHovered(5)).toBeFalsy();
        expect(gridState.isLetterHovered(100)).toBeFalsy();
    });

    it("should return id a letter is the current letter", () => {
        gridState.currentLetter = 3;

        expect(gridState.isLetterCurrent(gridState.currentLetter)).toBeTruthy();

        expect(gridState.isLetterCurrent(0)).toBeFalsy();
        expect(gridState.isLetterCurrent(gridState.currentLetter - 1)).toBeFalsy();
        expect(gridState.isLetterCurrent(gridState.currentLetter + 1)).toBeFalsy();
        expect(gridState.isLetterCurrent(100)).toBeFalsy();
    });

    it("should return id a letter is the current Orientation", () => {
        gridState.currentOrientation = Orientation.Across;

        expect(gridState.isCurrentOrientation(Orientation.Across)).toBeTruthy();
        expect(gridState.isCurrentOrientation(Orientation.Down)).toBeFalsy();

        gridState.currentOrientation = Orientation.Down;
        expect(gridState.isCurrentOrientation(Orientation.Down)).toBeTruthy();
        expect(gridState.isCurrentOrientation(Orientation.Across)).toBeFalsy();
    });

    it("should switch orientation", () => {
        gridState.currentOrientation = Orientation.Across;
        gridState.switchOrientation();

        expect(gridState.isCurrentOrientation(Orientation.Across)).toBeFalsy();
        expect(gridState.isCurrentOrientation(Orientation.Down)).toBeTruthy();
    });

    it("should unselect and unhover on unselect", () => {
        const orientation: Orientation = Orientation.Down;
        const currentLetter: number = 3;
        const selectedDisabledLetters: number[] = [ 0, 1, 2, 3, 4];

        gridState.currentOrientation = orientation;
        gridState.currentLetter = currentLetter;
        gridState.selectedLetters = selectedDisabledLetters;
        gridState.disabledLetters = selectedDisabledLetters;

        gridState.unselect();

        expect(gridState.isCurrentOrientation(orientation)).toBeFalsy();
        expect(gridState.isLetterCurrent(currentLetter)).toBeFalsy();

        selectedDisabledLetters.forEach((letterId: number) => {
            expect(gridState.isLetterSelected(letterId)).toBeFalsy();
            expect(gridState.isLetterDisabled(letterId)).toBeTruthy();
        });
    });

});
