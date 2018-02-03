import { Injectable } from "@angular/core";
import { CameraManagerService } from "../camera-manager-service/camera-manager.service";
import { RenderService, CarControls } from "../render-service/render.service";

const ACCELERATE_KEYCODE: number = 87; // w
const LEFT_KEYCODE: number = 65; // a
const BRAKE_KEYCODE: number = 83; // s
const RIGHT_KEYCODE: number = 68; // d
const CHANGE_CAMERA_KEYCODE: number = 67; // c
const TOOGLE_CAMERA_EFFECT_MODE: number = 88; // ,
const ZOOM_IN_KEYCODE: number = 187; // +
const ZOOM_OUT_KEYCODE: number = 189; // -
const NIGHT_MODE: number = 78; // n
const LIGTHS: number = 76; // l

@Injectable()
export class InputManagerService {

    private isLeftPressed: boolean;
    private isRightPressed: boolean;

    public constructor(private cameraManager: CameraManagerService, private renderService: RenderService) {
        this.isLeftPressed = false;
        this.isRightPressed = false;
     }

    // tslint:disable-next-line: max-func-body-length
    public handleKeyDown(event: KeyboardEvent): void {
        switch (event.keyCode) {
            case ACCELERATE_KEYCODE:
                this.renderService.handleCarInputsDown(CarControls.Accelerate);
                break;
            case LEFT_KEYCODE:
                this.renderService.handleCarInputsDown(CarControls.Left);
                this.isLeftPressed = true;
                break;
            case RIGHT_KEYCODE:
                this.renderService.handleCarInputsDown(CarControls.Right);
                this.isRightPressed = true;
                break;
            case BRAKE_KEYCODE:
                this.renderService.handleCarInputsDown(CarControls.Brake);
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
                // TODO
                break;
            case LIGTHS:
                // TODO
                break;
            default:
                break;
         }
     }

    // tslint:disable-next-line: max-func-body-length
    public handleKeyUp(event: KeyboardEvent): void {
    switch (event.keyCode) {
        case ACCELERATE_KEYCODE:
            this.renderService.handleCarInputsUp(CarControls.Accelerate);
            break;
        case LEFT_KEYCODE:
             this.isLeftPressed = false;
             if (this.isRightPressed) {
                this.renderService.handleCarInputsDown(CarControls.Right);
             } else {
                this.renderService.handleCarInputsUp(CarControls.Left);
             }
             break;
        case RIGHT_KEYCODE:
            this.isRightPressed = false;
            if (this.isLeftPressed) {
                this.renderService.handleCarInputsDown(CarControls.Left);
            } else {
                this.renderService.handleCarInputsUp(CarControls.Right);
            }
            break;
        case BRAKE_KEYCODE:
            this.renderService.handleCarInputsUp(CarControls.Brake);
            break;
        case ZOOM_IN_KEYCODE:
            this.cameraManager.zoomFactor = 0;
            break;
        case ZOOM_OUT_KEYCODE:
            this.cameraManager.zoomFactor = 0;
            break;
        case NIGHT_MODE:
            // TODO
            break;
        case LIGTHS:
            // TODO
            break;
        default:
            break;
    }
 }

}
