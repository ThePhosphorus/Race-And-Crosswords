import { Injectable } from "@angular/core";
import { Renderer } from "../renderer/renderer";
import { CameraManagerService } from "../camera-manager-service/camera-manager.service";
import { Track } from "../../../../../common/race/track";
import { CameraType } from "../../global-constants/constants";
import { AmbientLight, Vector3, Scene, Mesh, Color } from "three";
import {
    WHITE,
    AMBIENT_LIGHT_OPACITY,
    STARTING_CAMERA_HEIGHT
} from "../admin/track-editor.constants";
import { TrackLoaderService } from "../track-loader/track-loader.service";

const BACKGROUND_COLOR: number = 0x4682B4;
const HEIGHT_RATIO: number = 0.8;

@Injectable()
export class TrackPreviewService extends Renderer {

    public constructor(cameraManager: CameraManagerService, private _trackLoader: TrackLoaderService ) {
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
        const avgPoint: Vector3 = new Vector3(0, 0, 0);
        let height: number = 0;
        const meshs: Array<Mesh> =  this._trackLoader.getTrackMeshs(track);
        meshs.forEach((m) => {
            this.scene.add(m);
            avgPoint.add(m.position.clone().multiplyScalar(1 / meshs.length));
            height = Math.max(height, m.position.length());
        });
        this.cameraTargetPosition.copy(avgPoint);
        this.cameraManager.cameraDistanceToCar = height * HEIGHT_RATIO;
    }

    public resetDisplay(): void {
        this._scene = new Scene();
    }
}
