import { BrowserModule } from "@angular/platform-browser";
import { NgModule } from "@angular/core";
import { HttpClientModule } from "@angular/common/http";

import { AppComponent } from "./app.component";
import { GameComponent } from "./game-component/game.component";

import { RenderService } from "./render-service/render.service";
import { BasicService } from "./basic.service";
import { AppRoutingModule } from "./app-routing.module";
import { CrosswordsComponent } from "./crosswords-component/crosswords.component";

@NgModule({
    declarations: [
        AppComponent,
        GameComponent,
        CrosswordsComponent
    ],
    imports: [
        BrowserModule,
        HttpClientModule,
        AppRoutingModule
    ],
    providers: [
        RenderService,
        BasicService
    ],
    bootstrap: [AppComponent]
})
export class AppModule { }
