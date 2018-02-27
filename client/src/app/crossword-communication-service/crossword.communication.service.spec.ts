import { TestBed, inject } from "@angular/core/testing";
import { CrosswordCommunicationService } from "./crossword.communication.service";
import { HttpClientModule } from "@angular/common/http";
import { Difficulty, CrosswordGrid } from "../../../../common/communication/crossword-grid";

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

    // The following tests need the server to be ON
    it("should connect to server", inject( [CrosswordCommunicationService], (service: CrosswordCommunicationService) => {
        service.basicServerConnection().subscribe((res: string) => {
            expect(res).toBeDefined();
         });
     }));

    it("should get a crossword Grid", inject( [CrosswordCommunicationService], (service: CrosswordCommunicationService) => {
        service.getCrossword(Difficulty.Hard, 0.3, 2).subscribe((res: CrosswordGrid) => {
            expect(res).toBeDefined();
        });
    }));

 });
