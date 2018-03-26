import { Injectable } from "@angular/core";
import { Renderer } from "../../renderer/renderer";
import { CameraManagerService } from "../../camera-manager-service/camera-manager.service";
import { Track } from "../../../../../../common/race/track";
import { CameraType } from "../../../global-constants/constants";
import { AmbientLight, Vector3, Scene, Mesh, Vector2 } from "three";
import { WHITE, AMBIENT_LIGHT_OPACITY, STARTING_CAMERA_HEIGHT, SPHERE_GEOMETRY, WHITE_MATERIAL } from "../../admin/track-editor.constants";
import { Vector3Struct } from "../../../../../../common/race/vector3-struct";
import { TrackLoaderService } from "../../track-loader/track-loader.service";

@Injectable()
export class TrackPreviewService extends Renderer {

    public constructor(private cameraManager: CameraManagerService) {
        super(cameraManager, false);
    }

    public onInit(): void {
        this.cameraManager.cameraType = CameraType.Orthographic;
        this.scene.add(new AmbientLight(WHITE, AMBIENT_LIGHT_OPACITY));
        this.cameraManager.cameraDistanceToCar = STARTING_CAMERA_HEIGHT;
    }

    public displayPreview(track: Track): void {
        const avgPoint: Vector3 = new Vector3(0, 0, 0);
        let tmpPoint: Vector3 = new Vector3(0, 0, 0);
        track.points.forEach((point: Vector3Struct) => {
            const vecPoint: Vector3 = TrackLoaderService.toVector(point);
            avgPoint.add(vecPoint);
            this.scene.add(this.createDot(vecPoint, tmpPoint));
            tmpPoint = vecPoint;
        });
    }

    public resetDisplay(): void {
        this._scene = new Scene();
    }

    private createDot(pos: Vector3, topMesh: Vector3): Mesh {
        const circle: Mesh = new Mesh(SPHERE_GEOMETRY, WHITE_MATERIAL);
        circle.position.copy(this.getRelativePosition(this.toVector2(pos)));
        // if (topMesh) { this.createLine(topMesh, circle.position, circle.id); }
        this.scene.add(circle);

        return circle;
    }

    private toVector2(vec3: Vector3): Vector2 {
        return new Vector2(vec3.x, vec3.z);
    }
}
