import { TestBed, inject } from "@angular/core/testing";

import { LoaderService } from "./loader.service";
import {
    LoadedObject,
    LoadedAudio,
    LoadedTexture,
    LoadedCubeTexture
} from "./load-types.enum";
import { Object3D, Texture, CubeTexture } from "three";

// tslint:disable:max-func-body-length
// tslint:disable:no-magic-numbers

describe("LoaderServiceService", () => {
    beforeEach(() => {
        TestBed.configureTestingModule({
            providers: [LoaderService]
        });
        jasmine.DEFAULT_TIMEOUT_INTERVAL = 20000; // 60 Secs
    });

    it(
        "should be created",
        inject([LoaderService], (service: LoaderService) => {
            expect(service).toBeTruthy();
        })
    );

    it( "shouldn't have loaded anything at start for audio",
        inject([LoaderService], (service: LoaderService) => {
            for (const audioType of Object.keys(LoadedAudio)) {
                const type: number = Number(audioType);
                if (type) {
                    expect(service.getAudio(type)).toBeNull();
                }
            }
        })
    );

    it("should change loading status while loading", (done: DoneFn) =>
        inject([LoaderService], (service: LoaderService) => {
            let pastStatus: number = 0;

            service.startLoading();
            service.status.subscribe((status: number) => {
                expect(status).not.toBe(pastStatus);
                pastStatus = status;
                done();
            });

        }));

    it("Everything should be loaded once completed", (done: DoneFn) =>
        inject([LoaderService], (service: LoaderService) => {
            service.startLoading();
            service.isFinished.subscribe((finished: boolean) => {
                if (finished) {
                    for (const objectType of Object.keys(LoadedObject)) {
                        const type: number = Number(objectType);
                        if (type) {
                            expect(service.getObject(type)).not.toBeNull();
                        }
                    }

                    for (const audioType of Object.keys(LoadedAudio)) {
                        const type: number = Number(audioType);
                        if (type) {
                            expect(service.getAudio(type)).not.toBeNull();
                        }
                    }

                    for (const textureType of Object.keys(LoadedTexture)) {
                        const type: number = Number(textureType);
                        if (type) {
                            expect(service.getTexture(type)).not.toBeNull();
                        }
                    }

                    for (const cubeTextureType of Object.keys(
                        LoadedCubeTexture
                    )) {
                        const type: number = Number(cubeTextureType);
                        if (type) {
                            expect(service.getCubeTexture(type)).not.toBeNull();
                        }
                    }
                    done();
                }
            });
        }));
    it("should have different texture for offroad", inject([LoaderService], (loader: LoaderService) => {
        expect( loader.getTexture(LoadedTexture.offRoad) !== loader.getTexture(LoadedTexture.track)).toBeTruthy();
    }));
});
