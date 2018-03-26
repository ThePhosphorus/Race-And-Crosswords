import { Injectable } from "@angular/core";
import { Renderer } from "../../renderer/renderer";
import { CameraManagerService } from "../../camera-manager-service/camera-manager.service";
import { Track } from "../../../../../../common/race/track";
import { CameraType } from "../../../global-constants/constants";
import { AmbientLight, Vector3, Scene, Mesh, Geometry, Line } from "three";
import {
    WHITE,
    AMBIENT_LIGHT_OPACITY,
    STARTING_CAMERA_HEIGHT,
    SPHERE_GEOMETRY,
    WHITE_MATERIAL,
    LINE_MATERIAL
} from "../../admin/track-editor.constants";
import { Vector3Struct } from "../../../../../../common/race/vector3-struct";
import { TrackLoaderService } from "../../track-loader/track-loader.service";

@Injectable()
export class TrackPreviewService extends Renderer {

    public constructor(private cameraManager: CameraManagerService) {
        super(cameraManager, false);
    }

    public onInit(): void {
        this.cameraManager.cameraType = CameraType.Orthographic;
        this.cameraManager.cameraDistanceToCar = STARTING_CAMERA_HEIGHT;
        this.scene.add(new AmbientLight(WHITE, AMBIENT_LIGHT_OPACITY));
    }

    public displayPreview(track: Track): void {
        const avgPoint: Vector3 = new Vector3(0, 0, 0);
        let height: number = 0;
        let lastPos: Vector3;
        track.points.forEach((point: Vector3Struct) => {
            const vecPoint: Vector3 = TrackLoaderService.toVector(point);
            avgPoint.add(vecPoint.clone().multiplyScalar(1 / track.points.length));
            height = Math.max(height, vecPoint.length());
            this.createLine(lastPos, vecPoint);
            lastPos = vecPoint;
        });
        this.cameraTargetPosition.copy(avgPoint);
        this.cameraManager.cameraDistanceToCar = height;
    }

    public resetDisplay(): void {
        this._scene = new Scene();
    }

    private createLine(from: Vector3, to: Vector3): void {
        if (!from) {
            return;
        }
        const lineG: Geometry = new Geometry();
        lineG.vertices.push(from, to);
        this.scene.add(new Line(lineG, LINE_MATERIAL));
    }
}
