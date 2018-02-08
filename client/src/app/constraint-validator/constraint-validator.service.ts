import { Injectable } from "@angular/core";
import { Vector3, Mesh } from "three";

const MINIMUM_ANGLE: number = 2.35619;
const TWICE_TRACK_WIDTH: number = 5;

@Injectable()
export class ConstraintValidatorService {

  private _points: Array<Mesh>;

  public constructor() {
    this._points = new Array<Mesh>();
  }

  private get points(): Array<Vector3> {
    return this._points.map((p) => p.position);
  }

  public setPoints(points: Array<Mesh>): void {
    this._points = points;
  }

  public validateLine(index1: number, index2: number): boolean {
    const line: Vector3 = new Vector3().subVectors(this.points[index2], this.points[index1]);
    const previousLine: Vector3 = this.points[index1 - 1] ? new Vector3().subVectors(this.points[index1], this.points[index1 - 1]) : null;
    const nextLine: Vector3 = this.points[index2 + 1] ? new Vector3().subVectors(this.points[index2 + 1], this.points[index2]) : null;

    return this.validateLength(line)
      && this.validateAngle(previousLine, line)
      && this.validateAngle(line, nextLine)
      && this.validateIntersection(index1, index2);
  }

  private validateLength(v: Vector3): boolean {
    return v != null && v.length() > TWICE_TRACK_WIDTH;
  }

  private validateAngle(v1: Vector3, v2: Vector3): boolean {
    return (v1 == null || v2 == null) || v1.angleTo(v2) < MINIMUM_ANGLE;
  }

  private validateIntersection(index1: number, index2: number): boolean {
    const line: Vector3 = new Vector3().subVectors(this.points[index2], this.points[index1]);
    for (let i: number = 0; i < this.points.length - 1; i++) {
      if (this.points[i + 1] != null && i !== index1 && i + 1 !== index2) {
        const compare: Vector3 = new Vector3().subVectors(this.points[i + 1], this.points[i]);
        const denominator: number = (compare.z * line.x) - (compare.x * line.z);
        if (denominator === 0) {
          return false;
        }
        let a: number = this.points[index1].z - this.points[i].z;
        let b: number = this.points[index1].x - this.points[i].x;
        const numerator1: number = ((this.points[i + 1].x - this.points[i].x) * a) - ((this.points[i + 1].z - this.points[i].z) * b);
        const numerator2: number = ((this.points[index2].x - this.points[index1].x) * a)
                                   - ((this.points[index2].z - this.points[index1].z) * b);
        a = numerator1 / denominator;
        b = numerator2 / denominator;

        if (a > 0 && a < 1 && b > 0 && b < 1) {
          return false;
        }
      }
    }

    return true;
  }

}
