import { Request, Response, NextFunction } from "express";
import { Message } from "../../../../common/communication/message";
import "reflect-metadata";
import { injectable, } from "inversify";
import * as http from "http";

module ServiceLexicalMicroservice {

    @injectable()
    export class ServiceLexical {

        public processConstraints(req: Request, res: Response, next: NextFunction): void {
            // JSON.parse(req);
            const message: Message = new Message();
            message.title = "Hello";
            message.body = "World";
            res.send(JSON.stringify(message));
        }
        public makeQuery(isRare: boolean, lettres: string){
            let query: string = "https://api.datamuse.com/words?sp=" + lettres + "&qe&md=df";
            let correspondingWords = http.get(query, res =>{//SOME LOGIC
                
            });

        }
    }
}

export = ServiceLexicalMicroservice;
