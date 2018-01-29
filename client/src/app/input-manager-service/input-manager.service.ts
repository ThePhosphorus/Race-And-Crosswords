import { Injectable } from '@angular/core';
import { Car } from "../car/car";
import { CameraManagerService } from "../camera-manager-service/camera-manager.service";


const ACCELERATE_KEYCODE: number = 87; // w
const LEFT_KEYCODE: number = 65; //a
const BRAKE_KEYCODE: number = 83; // s
const RIGHT_KEYCODE: number = 68; // d
const CHANGE_CAMERA_KEYCODE: number = 67; // c
const TOOGLE_CAMERA_EFFECT_MODE: number = 88; //,
const ZOOM_IN_KEYCODE: number = 187; // +
const ZOOM_OUT_KEYCODE: number = 189; // -
const NIGHT_MODE: number = 78; // n
const LIGTHS: number = 76; // l

@Injectable()
export class InputManagerService {
    

  constructor(private cameraManager: CameraManagerService) {
     
   }

  public handleKeyDown(event: KeyboardEvent, _car: Car): void {
    switch (event.keyCode) {
        case ACCELERATE_KEYCODE:
           _car.isAcceleratorPressed = true;
            break;
        case LEFT_KEYCODE:
            _car.steerLeft();
            break;
        case RIGHT_KEYCODE:
           _car.steerRight();
            break;
        case BRAKE_KEYCODE:
            _car.brake();
            break;
        case CHANGE_CAMERA_KEYCODE:
            this.cameraManager.switchCamera();
            break;
        case TOOGLE_CAMERA_EFFECT_MODE:
            this.cameraManager.effectModeEnabled = !this.cameraManager.effectModeEnabled;
            break;
        case ZOOM_IN_KEYCODE:
            this.cameraManager.zoomFactor = 1;
            break;
        case ZOOM_OUT_KEYCODE:
            this.cameraManager.zoomFactor = -1;
            break;
        case NIGHT_MODE:
            //TODO
            break;
        case LIGTHS:
            //TODO
            break;
        default:
            break;
    }
 }

public handleKeyUp(event: KeyboardEvent, _car: Car): void {
    switch (event.keyCode) {
        case ACCELERATE_KEYCODE:
           _car.isAcceleratorPressed = false;
            break;
        case LEFT_KEYCODE:
        case RIGHT_KEYCODE:
            _car.releaseSteering();
            break;
        case BRAKE_KEYCODE:
            _car.releaseBrakes();
            break;
        case ZOOM_IN_KEYCODE:
            this.cameraManager.zoomFactor = 0;
            break;
        case ZOOM_OUT_KEYCODE:
            this.cameraManager.zoomFactor = 0;
            break;
        case NIGHT_MODE:
            //TODO
            break;
        case LIGTHS:
            //TODO
            break;
        default:
            break;
    }
 }

}
