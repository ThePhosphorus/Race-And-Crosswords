import { Mesh, Object3D, PlaneGeometry, Plane } from "three";
import { Collider } from "../collision/collider";

const WALL_WIDTH: number = 0.001;

export class Road extends Object3D {

    public meshs: Mesh[];
    public constructor(meshs: Mesh[]) {
        super();
        this.meshs = meshs;
        this.initTrack();
    }

    private initTrack(): void {
        // meshs.forEach((m) => this.add(m));
        for (let i: number = 0; i < this.meshs.length; i++) {
            if (this.meshs[i].geometry instanceof PlaneGeometry) {
                // const prev: Mesh = this.findPrevious(i);
                // const next: Mesh = this.findNext(i);
                // const coll1: Collider = new Collider(WALL_WIDTH, 0);
                this.add(this.meshs[i]);
            }
        }
    }

    private findPrevious(index: number): Mesh {
        while (!(this.meshs[index] instanceof PlaneGeometry)) {
            index--;
            if (index < 0) {
                index = this.meshs.length - 1;
            }
        }

        return this.meshs[index];
    }

    private findNext(index: number): Mesh {
        while (!(this.meshs[index] instanceof PlaneGeometry)) {
            index++;
            if (index >= this.meshs.length) {
                index = 0;
            }
        }

        return this.meshs[index];
    }
}
