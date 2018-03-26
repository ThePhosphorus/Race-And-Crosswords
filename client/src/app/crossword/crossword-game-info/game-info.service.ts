import { Injectable, Output, EventEmitter } from "@angular/core";

@Injectable()
export class GameInfoService {
    public showModal: boolean;
    @Output() public showSearching: EventEmitter<boolean>;

    public constructor() {
        this.showModal = true;
        this.showSearching = new EventEmitter<boolean>();
    }

}
