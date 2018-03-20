import { Injectable } from "@angular/core";
import { HttpClient } from "@angular/common/http";
import { CrosswordGrid } from "../../../../../common/crossword/crossword-grid";
import { Observable } from "rxjs/Observable";
import { BACKEND_URL } from "../../global-constants/constants";
import { Difficulty } from "../../../../../common/crossword/enums-constants";

@Injectable()
export class CrosswordCommunicationService {

  public constructor(private http: HttpClient) { }

  public getCrossword(difficulty: Difficulty, blackTile: number, size: number): Observable<CrosswordGrid> {
    return this.http.get<CrosswordGrid>(
        BACKEND_URL + "crosswords/grid?" +
        "difficulty=" + difficulty +
        "&size=" + size );
  }

  public basicServerConnection(): Observable<string> {
    return this.http.get<string>( BACKEND_URL + "/");
  }

}
