import { BrowserModule } from "@angular/platform-browser";
import { NgModule } from "@angular/core";
import { HttpClientModule } from "@angular/common/http";

import { AppComponent } from "./app.component";
import { GameComponent } from "./game-component/game.component";

import { RenderService } from "./render-service/render.service";
import { BasicService } from "./basic.service";

@NgModule({
    declarations: [
        AppComponent,
        GameComponent
    ],
    imports: [
        BrowserModule,
        HttpClientModule
    ],
    providers: [
        RenderService,
        BasicService
    ],
    bootstrap: [AppComponent]
})
export class AppModule { }
