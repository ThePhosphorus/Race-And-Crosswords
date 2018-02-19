import { Vector3 } from "three";

export class Track {
    public constructor(id: number, name: string) {
        this.id = id;
        this.name = name;
    }

    public id: number;
    public name: string;
    public points: Array<Vector3>;
}
