import { TestBed, inject } from "@angular/core/testing";

import { GameInfoService } from "./game-info.service";
import { Difficulty } from "../../../../../../common/crossword/enums-constants";
import { CrosswordService } from "../../crossword-service/crossword.service";
import { CrosswordCommunicationService } from "../../crossword-communication-service/crossword.communication.service";
import { HttpClientModule } from "@angular/common/http";

describe("GameInfoService", () => {
    beforeEach(() => {
        TestBed.configureTestingModule({
            imports: [HttpClientModule],
            providers: [GameInfoService, CrosswordService, CrosswordCommunicationService]
        });
    });

    it("should be created", inject([GameInfoService], (service: GameInfoService) => {
        expect(service).toBeTruthy();
    }));

    it("should be able to set difficulty", inject([GameInfoService], (service: GameInfoService) => {
        const diff: Difficulty = Difficulty.Medium;
        service.setLvl(diff);
        expect(service.lvl.getValue()).toBe(diff);
    }));
    it("should be able to set showLoading", inject([GameInfoService], (service: GameInfoService) => {
        service.setShowSearching(true);
        expect(service.showSearching.getValue()).toBe(true);
    }));
    it("should be able to set showModal", inject([GameInfoService], (service: GameInfoService) => {
        service.setShowModal(true);
        expect(service.showModal.getValue()).toBe(true);
    }));

});
