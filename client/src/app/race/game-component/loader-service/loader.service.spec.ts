import { TestBed, inject } from "@angular/core/testing";

import { LoaderService } from "./loader.service";
import { LoadedObject, LoadedAudio, LoadedTexture, LoadedCubeTexture } from "./load-types.enum";

// tslint:disable:max-func-body-length

describe("LoaderServiceService", () => {
    beforeEach(() => {
        TestBed.configureTestingModule({
            providers: [LoaderService]
        });
    });

    it(
        "should be created",
        inject([LoaderService], (service: LoaderService) => {
            expect(service).toBeTruthy();
        })
    );

    it(
        "shouldn't have loaded anything at start",
        inject([LoaderService], (service: LoaderService) => {
            for (const objectType of Object.keys(LoadedObject)) {
                const type: number = Number(objectType);
                if (type) {
                    expect(service.getObject(type)).toBeNull();
                }
            }

            for (const audioType of Object.keys(LoadedAudio)) {
                const type: number = Number(audioType);
                if (type) {
                    expect(service.getObject(type)).toBeNull();
                }
            }

            for (const textureType of Object.keys(LoadedTexture)) {
                const type: number = Number(textureType);
                if (type) {
                    expect(service.getObject(type)).toBeNull();
                }
            }

            for (const cubeTextureType of Object.keys(LoadedCubeTexture)) {
                const type: number = Number(cubeTextureType);
                if (type) {
                    expect(service.getObject(type)).toBeNull();
                }
            }
        })
    );

    it( "Everything shoulb be leaded once completed", (done: DoneFn) => inject([LoaderService], (service: LoaderService) => {
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
                        expect(service.getObject(type)).not.toBeNull();
                    }
                }

                for (const textureType of Object.keys(LoadedTexture)) {
                    const type: number = Number(textureType);
                    if (type) {
                        expect(service.getObject(type)).not.toBeNull();
                    }
                }

                for (const cubeTextureType of Object.keys(LoadedCubeTexture)) {
                    const type: number = Number(cubeTextureType);
                    if (type) {
                        expect(service.getObject(type)).not.toBeNull();
                    }
                }
                done();
            }
        });
    }));
});
