import { Injectable } from "@angular/core";
import { HttpClient } from "@angular/common/http";
import { CrosswordGrid, Difficulty } from "../../../../common/communication/crossword-grid";
import { Observable } from "rxjs/Observable";

const SERVER_URL: string = "http://localhost:3000";

@Injectable()
export class CrosswordCommunicationService {

  public constructor(private http: HttpClient) { }

  public getCrossword(difficulty: Difficulty, blackTile: number, size: number): Observable<CrosswordGrid> {
    return this.http.get<CrosswordGrid>(
        SERVER_URL + "/crossword/grid?" +
        "difficulty=" + difficulty +
        "&tiles=" + blackTile + "&size=" + size );
  }

  public basicServerConnection(): Observable<string> {
    return this.http.get<string>( SERVER_URL + "/");
  }

}
