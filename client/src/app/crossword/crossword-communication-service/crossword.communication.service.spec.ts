import { TestBed, inject } from "@angular/core/testing";
import { CrosswordCommunicationService } from "./crossword.communication.service";
import { HttpClientModule } from "@angular/common/http";
import { CrosswordGrid } from "../../../../../common/crossword/crossword-grid";
import { Difficulty } from "../../../../../common/crossword/enums-constants";

// tslint:disable:no-magic-numbers
describe("CommunicationService", () => {

    beforeEach(() => {
        TestBed.configureTestingModule({
            imports: [HttpClientModule],
            providers: [CrosswordCommunicationService]
         });
     });

    it("should be created", inject( [CrosswordCommunicationService], (service: CrosswordCommunicationService) => {
        expect(service).toBeTruthy();
     }));

    it("should get a crossword Grid", inject( [CrosswordCommunicationService], (service: CrosswordCommunicationService) => {
        service.getCrossword(Difficulty.Hard, 0.3, 2).subscribe((res: CrosswordGrid) => {
            expect(res).toBeDefined();
        });
    }));

 });
