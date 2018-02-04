import { Component, OnInit } from "@angular/core";

@Component({
  selector: "app-crosswords",
  templateUrl: "./crosswords.component.html",
  styleUrls: ["./crosswords.component.css"]
})
export class CrosswordsComponent implements OnInit {

  public constructor() { }

  public words: string[][];
  public definitions: string [][];

  public ngOnInit(): void {
    // Temp

    this.words = [["-", "b", "c", "d", "e", "f", "g", "h", "i", "j"],
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
    this.definitions = [["Across definition", "Down definition"],
                        ["Across definition", "Down definition"],
                        ["", "Down definition"]
                       ];
  }

}
