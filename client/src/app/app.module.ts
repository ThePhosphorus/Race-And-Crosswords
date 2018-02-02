import { BrowserModule } from "@angular/platform-browser";
import { NgModule } from "@angular/core";
import { HttpClientModule } from "@angular/common/http";
import { FormsModule } from "@angular/forms";

import { AppComponent } from "./app.component";
import { GameComponent } from "./game-component/game.component";

import { AppRoutingModule } from "./app-routing.module";
import { CrosswordsComponent } from "./crosswords-component/crosswords.component";
import { PlayermodeComponent } from "./playermode-component/playermode.component";
import { InputManagerService } from './input-manager-service/input-manager.service';
import { CameraManagerService } from './camera-manager-service/camera-manager.service';
import { RenderService } from './render-service/render.service';

@NgModule({
    declarations: [
        AppComponent,
        GameComponent,
        CrosswordsComponent,
        PlayermodeComponent
    ],
    imports: [
        BrowserModule,
        HttpClientModule,
        AppRoutingModule,
        FormsModule
    ],
    providers: [
        RenderService,
        CameraManagerService,
        InputManagerService
    ],
    bootstrap: [AppComponent]
})
export class AppModule { }
