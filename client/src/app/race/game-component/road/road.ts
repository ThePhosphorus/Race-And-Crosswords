import { Mesh, Object3D, PlaneGeometry, Vector2 } from "three";
import { Collider } from "../collision/collider";
import { RigidBody } from "../rigid-body/rigid-body";
import { DEFAULT_MASS, DEFAULT_TRACK_WIDTH } from "../../race.constants";
import { HALF } from "../../../global-constants/constants";

const WALL_WIDTH: number = 2;

class WallDimensions {
    public constructor(public length: number, public offset: Vector2) {}
}

export class Road extends Object3D {

    public meshs: Mesh[];
    public constructor(meshs: Mesh[]) {
        super();
        this.meshs = meshs;
        this.initTrack();
    }

    private initTrack(): void {
        for (let i: number = 0; i < this.meshs.length; i++) {
            if (this.meshs[i].geometry instanceof PlaneGeometry) {
                this.meshs[i].geometry.computeBoundingBox();
                const prev: Mesh = this.findPrevious(i);
                const next: Mesh = this.findNext(i);
                const dimension1: WallDimensions = this.calculateLeftWallDimension(this.meshs[i], prev, next);
                const dimension2: WallDimensions = this.calculateRightWallDimension(this.meshs[i], prev, next);
                const coll1: Collider = new Collider(WALL_WIDTH, dimension1.length, dimension1.offset);
                const coll2: Collider = new Collider(WALL_WIDTH, dimension2.length, dimension2.offset);
                const rb: RigidBody = new RigidBody(DEFAULT_MASS, true);
                this.meshs[i].add(rb, coll1, coll2);
                this.add(this.meshs[i]);
            }
        }
    }

    private findPrevious(index: number): Mesh {
        do {
            index--;
            if (index < 0) {
                index = this.meshs.length - 1;
            }
        } while (!(this.meshs[index].geometry instanceof PlaneGeometry));

        return this.meshs[index];
    }

    private findNext(index: number): Mesh {
        index = index >= this.meshs.length ? 0 : index;
        do {
            index++;
            if (index >= this.meshs.length) {
                index = 0;
            }
        } while (!(this.meshs[index++].geometry instanceof PlaneGeometry));

        return this.meshs[index];
    }

    private calculateLeftWallDimension(mesh: Mesh, prev: Mesh, next: Mesh): WallDimensions {
        const length: number = mesh.geometry.boundingBox.getSize().z - DEFAULT_TRACK_WIDTH;
        const offset: Vector2 = new Vector2(-DEFAULT_TRACK_WIDTH * HALF, 0);

        return new WallDimensions(length, offset);
    }

    private calculateRightWallDimension(mesh: Mesh, prev: Mesh, next: Mesh): WallDimensions {
        const length: number = mesh.geometry.boundingBox.getSize().z - DEFAULT_TRACK_WIDTH;
        const offset: Vector2 = new Vector2(DEFAULT_TRACK_WIDTH * HALF, 0);

        return new WallDimensions(length, offset);
    }
}
