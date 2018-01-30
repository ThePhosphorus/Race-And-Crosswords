import { Component, OnInit } from "@angular/core";

@Component({
    selector: "app-crosswords",
    templateUrl: "./crosswords.component.html",
    styleUrls: ["./crosswords.component.css"]
})
export class CrosswordsComponent implements OnInit {

    public constructor() { }

    public words: string[][] = [["-", "b", "c", "d", "e", "f", "g", "h", "i", "j"],
                                ["a", "b", "c", "d", "e", "f", "g", "h", "i", "j"],
                                ["a", "b", "c", "d", "e", "f", "g", "h", "i", "j"],
                                ["a", "b", "c", "d", "e", "f", "g", "h", "i", "j"],
                                ["a", "b", "c", "d", "e", "-", "g", "h", "i", "j"],
                                ["a", "b", "c", "d", "e", "f", "g", "h", "-", "j"],
                                ["a", "-", "c", "d", "e", "f", "g", "h", "i", "j"],
                                ["a", "b", "c", "d", "e", "f", "g", "h", "i", "j"],
                                ["a", "b", "c", "d", "e", "f", "-", "h", "i", "j"],
                                ["a", "b", "c", "d", "e", "f", "-", "h", "i", "j"],
                                ];
    public definitions: string[][] = [["Across definition", "Down definition"],
                                      ["Across definition", "Down definition"],
                                      ["", "Down definition"]];

    public ngOnInit(): void {
    }

    public validateInput(event: KeyboardEvent): void {
        const letters: RegExp = /^[A-Za-z]+$/;
        const lowerCase: RegExp = /^[a-z]+$/;
        const inputChar: string = String.fromCharCode(event.charCode);

        if (!letters.test(inputChar)) {
            event.preventDefault();
        }
        if (lowerCase.test(inputChar)) {
            (event.target as HTMLInputElement).value = inputChar.toUpperCase();
        }
    }

}
