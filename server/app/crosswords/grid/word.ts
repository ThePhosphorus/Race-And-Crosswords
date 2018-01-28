enum Orientation {
    Vertical = "Vertical",
    Horizontal = "Horizontal",
}

class Word {

    public row: Number;
    public column: Number;
    public wordString: string;
    public definitions: string[];
    public orientation: Orientation;
}
