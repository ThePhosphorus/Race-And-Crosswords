import { Mesh, Object3D, PlaneGeometry, Vector2 } from "three";
import { Collider } from "../collision/collider";
import { RigidBody } from "../rigid-body/rigid-body";
import { DEFAULT_MASS } from "../../race.constants";

const WALL_WIDTH: number = 10;

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
                const coll1: Collider = new Collider(WALL_WIDTH, this.calculateLeftWallDimension(this.meshs[i], prev, next).length);
                const coll2: Collider = new Collider(WALL_WIDTH, this.calculateRightWallDimension(this.meshs[i], prev, next).length);
                const rb: RigidBody = new RigidBody(DEFAULT_MASS, true);
                this.meshs[i].add(rb, coll1, coll2);
            }
            this.add(this.meshs[i]);
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
        const length: number = mesh.geometry.boundingBox.getSize().z;
        if (mesh.getWorldDirection().clone().cross(next.getWorldDirection().clone()).y > 0) {
            // do stuff
        }

        return new WallDimensions(length, new Vector2(0, 0));
    }

    private calculateRightWallDimension(mesh: Mesh, prev: Mesh, next: Mesh): WallDimensions {
        const length: number = mesh.geometry.boundingBox.getSize().z;
        if (mesh.getWorldDirection().clone().cross(next.getWorldDirection().clone()).y > 0) {
            // do stuff
        }

        return new WallDimensions(length, new Vector2(0, 0));
    }
}
