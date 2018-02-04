import { TestBed, inject } from "@angular/core/testing";

import { CommunicationService } from "./communication.service";
import { HttpClientModule } from "@angular/common/http/";

describe("CommunicationService", () => {

    beforeEach(() => {
        TestBed.configureTestingModule({
            imports: [HttpClientModule],
            providers: [CommunicationService]
         });
     });

    it("should be created", inject( [CommunicationService], (service: CommunicationService) => {
        expect(service).toBeTruthy();
     }));

    it("should connect to server", inject( [CommunicationService], (service: CommunicationService) => {
        service.basicServerConnection().subscribe((res: string) => {
            expect(res).toBeTruthy();
         });
     }));

 });
