export const LENGTH_MISMATCH_EXCEPTION_MSG: string = "length mismatch exception";
export class LengthMismatchException extends Error {
    public constructor() {
        super (LENGTH_MISMATCH_EXCEPTION_MSG);
    }
}
