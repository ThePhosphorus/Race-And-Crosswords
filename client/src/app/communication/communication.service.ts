import { Injectable } from "@angular/core";
import { Http, Response } from "@angular/http";
import { CrosswordGrid } from "../../../../common/communication/crossword-grid";
import { Observable } from "rxjs/Observable";

const SERVER_LINK: string = "localhost:3000";

@Injectable()
export class CommunicationService {

  public constructor(private http: Http) { }

//   public getCrossword(): Promise<CrosswordGrid> {
//     return this.http.get();
//   }

  public basicServerConnection(): Observable<Response> {
    return this.http.get( SERVER_LINK + "/");
  }

}
