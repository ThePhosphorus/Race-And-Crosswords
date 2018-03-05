import { Object3D, Vector3 } from "three";
import { COLLIDER_NAME } from "../../../../global-constants/constants";

export abstract class Collider extends Object3D {
    public constructor() {
        super();
        this.name = COLLIDER_NAME;
    }

    public abstract get broadRadius(): number;
    public abstract get position(): Vector3;
}
