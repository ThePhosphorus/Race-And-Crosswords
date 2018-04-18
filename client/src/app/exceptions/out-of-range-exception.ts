export const OUT_OF_RANGE_EXCEPTION_MSG: string = "Index is out of range";
export class OutOfRangeException extends Error {
    public constructor() {
        super (OUT_OF_RANGE_EXCEPTION_MSG);
    }
}
