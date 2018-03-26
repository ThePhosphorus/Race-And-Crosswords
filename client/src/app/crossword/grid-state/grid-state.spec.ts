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
            expect(gridState.LIsDisabled(letterId)).toBeTruthy();
        });

        expect(gridState.LIsDisabled(-1)).toBeFalsy();
        expect(gridState.LIsDisabled(5)).toBeFalsy();
        expect(gridState.LIsDisabled(100)).toBeFalsy();
    });

    it("should return if a letter is selected", () => {
        gridState.selectedLetters = [ 0, 1, 2, 3, 4];

        gridState.selectedLetters.forEach((letterId: number) => {
            expect(gridState.LIsSelected(letterId)).toBeTruthy();
        });

        expect(gridState.LIsSelected(-1)).toBeFalsy();
        expect(gridState.LIsSelected(5)).toBeFalsy();
        expect(gridState.LIsSelected(100)).toBeFalsy();
    });

    it("should return if a letter is hovered", () => {
        gridState.hoveredLetters = [ 0, 1, 2, 3, 4];

        gridState.hoveredLetters.forEach((letterId: number) => {
            expect(gridState.LIsHovered(letterId)).toBeTruthy();
        });

        expect(gridState.LIsHovered(-1)).toBeFalsy();
        expect(gridState.LIsHovered(5)).toBeFalsy();
        expect(gridState.LIsHovered(100)).toBeFalsy();
    });

    it("should return id a letter is the current letter", () => {
        gridState.currentLetter = 3;

        expect(gridState.LIsCurrentLetter(gridState.currentLetter)).toBeTruthy();

        expect(gridState.LIsCurrentLetter(0)).toBeFalsy();
        expect(gridState.LIsCurrentLetter(gridState.currentLetter - 1)).toBeFalsy();
        expect(gridState.LIsCurrentLetter(gridState.currentLetter + 1)).toBeFalsy();
        expect(gridState.LIsCurrentLetter(100)).toBeFalsy();
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
        expect(gridState.LIsCurrentLetter(currentLetter)).toBeFalsy();

        selectedDisabledLetters.forEach((letterId: number) => {
            expect(gridState.LIsSelected(letterId)).toBeFalsy();
            expect(gridState.LIsDisabled(letterId)).toBeTruthy();
        });
    });

});
