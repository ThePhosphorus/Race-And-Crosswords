export const EMPTY_ARRAY_EXCEPTION_MSG: string = "Array is Empty";
export class EmptyArrayException extends Error {
    public constructor() {
        super(EMPTY_ARRAY_EXCEPTION_MSG);
    }
}
