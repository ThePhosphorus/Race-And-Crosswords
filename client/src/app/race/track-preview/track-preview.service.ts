import { Injectable } from "@angular/core";
import { Renderer } from "../renderer/renderer";
import { CameraManagerService } from "../camera-manager-service/camera-manager.service";
import { Track } from "../../../../../common/race/track";
import { CameraType } from "../../global-constants/constants";
import { AmbientLight, Scene, Color } from "three";
import {
    WHITE,
    AMBIENT_LIGHT_OPACITY,
    STARTING_CAMERA_HEIGHT
} from "../admin/track-editor.constants";
import { TrackMeshGenerator } from "../track-loader/track-mesh-generator";

const BACKGROUND_COLOR: number = 0x4682B4;
const HEIGHT_RATIO: number = 0.5;

@Injectable()
export class TrackPreviewService extends Renderer {

    public constructor(cameraManager: CameraManagerService) {
        super(cameraManager, false);
    }

    public onInit(): void {
        this.cameraManager.cameraType = CameraType.Orthographic;
        this.cameraManager.cameraDistanceToCar = STARTING_CAMERA_HEIGHT;
        this.scene.add(new AmbientLight(WHITE, AMBIENT_LIGHT_OPACITY));
        this.scene.background = new Color(BACKGROUND_COLOR);
    }

    public displayPreview(track: Track): void {
        this._scene = new Scene();
        this.scene.add(new AmbientLight(WHITE, AMBIENT_LIGHT_OPACITY));
        this.scene.background = new Color(BACKGROUND_COLOR);

        const trackGen: TrackMeshGenerator = new TrackMeshGenerator(track);
        this.scene.add(trackGen.newMesh);
        this.scene.add(trackGen.startMesh);

        this.cameraTargetPosition.copy(trackGen.center);
        this.cameraManager.cameraDistanceToCar = trackGen.height * HEIGHT_RATIO;
    }

    public resetDisplay(): void {
        this._scene = new Scene();
    }
}
