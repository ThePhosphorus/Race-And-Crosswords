import { Object3D } from "three";
import { COLLIDER_NAME } from "../../../../global-constants/constants";

export abstract class Collider extends Object3D {
    public constructor() {
        super();
        this.name = COLLIDER_NAME;
    }
}
