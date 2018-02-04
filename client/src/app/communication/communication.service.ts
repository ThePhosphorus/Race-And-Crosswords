import { Injectable } from "@angular/core";
import { HttpClient } from "@angular/common/http";
// import { CrosswordGrid } from "../../../../common/communication/crossword-grid";
import { Observable } from "rxjs/Observable";

const SERVER_LINK: string = "localhost:3000";

@Injectable()
export class CommunicationService {

  public constructor(private http: HttpClient) { }

//   public getCrossword(): Promise<CrosswordGrid> {
//     return this.http.get();
//   }

  public basicServerConnection(): Observable<string> {
    return this.http.get<string>( SERVER_LINK + "/");
  }

}
