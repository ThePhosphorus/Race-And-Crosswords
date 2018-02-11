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

  public validateLine(p1: Vector3, p2: Vector3): boolean {
    const line: Vector3 = new Vector3().subVectors(p2, p1);
    const previousLine: Vector3 = this.findPreviousLine(p1);
    const nextLine: Vector3 = this.findNextLine(p2);

    return this.validateLength(line)
      && this.validateAngle(previousLine, line)
      && this.validateAngle(line, nextLine)
      && this.validateIntersection(p1, p2);
  }

  private findNextLine(point: Vector3): Vector3 {
    const index: number = this.points.findIndex((p) => p.equals(point));
    if (index === null) {
      return null;
    }

    const nextIndex: number = (index !== this._points.length - 1) ? index + 1 :
      (this._points[this._points.length - 1].position.equals(this._points[0].position)) ? 0 : null;

    return this._points[nextIndex] ? new Vector3().subVectors(this._points[nextIndex].position, point) : null;
  }

  private findPreviousLine(point: Vector3): Vector3 {
    const index: number = this.points.findIndex((p) => p.equals(point));
    const previousIndex: number = (index !== 0) ? index - 1 :
      (this._points[this._points.length - 1].position.equals(this._points[0].position)) ?  this._points.length - 1 : null;

    return this._points[previousIndex] ? new Vector3().subVectors(point, this._points[previousIndex].position) : null;
  }

  private validateLength(v: Vector3): boolean {
    return v != null && v.length() > TWICE_TRACK_WIDTH;
  }

  private validateAngle(v1: Vector3, v2: Vector3): boolean {
    return (v1 == null || v2 == null) || v1.angleTo(v2) < MINIMUM_ANGLE;
  }

  private validateIntersection(p1: Vector3, p2: Vector3): boolean {
    const line: Vector3 = new Vector3().subVectors(p2, p1);
    for (let i: number = 0; i < this.points.length - 1; i++) {
      if (this.points[i + 1] != null && !this.points[i].equals(p1) && !this.points[i + 1].equals(p2)) {
        const compare: Vector3 = new Vector3().subVectors(this.points[i + 1], this.points[i]);
        const denominator: number = (compare.z * line.x) - (compare.x * line.z);
        if (denominator === 0) {
          return false;
        }
        let a: number = p1.z - this.points[i].z;
        let b: number = p1.x - this.points[i].x;
        const numerator1: number = ((this.points[i + 1].x - this.points[i].x) * a) - ((this.points[i + 1].z - this.points[i].z) * b);
        const numerator2: number = ((p2.x - p1.x) * a)
                                   - ((p2.z - p1.z) * b);
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
