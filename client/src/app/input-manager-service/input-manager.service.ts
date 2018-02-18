import { Injectable } from "@angular/core";
import { CameraManagerService } from "../camera-manager-service/camera-manager.service";
import { RenderService, CarControls } from "../render-service/render.service";

export const ACCELERATE_KEYCODE: number = 87; // w
export const LEFT_KEYCODE: number = 65; // a
export const BRAKE_KEYCODE: number = 83; // s
export const RIGHT_KEYCODE: number = 68; // d
export const CHANGE_CAMERA_KEYCODE: number = 67; // c
export const TOOGLE_CAMERA_EFFECT_MODE: number = 88; // ,
export const ZOOM_IN_KEYCODE: number = 187; // +
export const ZOOM_OUT_KEYCODE: number = 189; // -
export const NIGHT_MODE: number = 78; // n
export const LIGTHS: number = 76; // l

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
                this.cameraManager.zoomIn();
                break;
            case ZOOM_OUT_KEYCODE:
                this.cameraManager.zoomOut();
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
                this.cameraManager.zoomRelease();
                break;
            case ZOOM_OUT_KEYCODE:
                this.cameraManager.zoomRelease();
                break;
            default:
                break;
        }
     }

}
