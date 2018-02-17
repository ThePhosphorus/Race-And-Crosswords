import { Injectable } from "@angular/core";
import { Vector3 } from "three";
import { Vector3Struct } from "../../../../common/communication/track";

@Injectable()
export class TrackLoaderService {
    public constructor() {}

    public toVector(vector: Vector3Struct): Vector3 {
        return new Vector3(vector.x, vector.y, vector.z);
    }
}
