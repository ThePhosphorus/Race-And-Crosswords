import { BrowserModule } from "@angular/platform-browser";
import { NgModule } from "@angular/core";
import { HttpClientModule } from "@angular/common/http";
import { FormsModule } from "@angular/forms";

import { AppComponent } from "./app.component";
import { GameComponent } from "./game-component/game.component";

import { AppRoutingModule } from "./app-routing.module";
import { CrosswordsComponent } from "./crosswords-component/crosswords.component";
import { PlayermodeComponent } from "./playermode-component/playermode.component";
import { HomePageComponent } from "./home-page/home-page.component";
import { AdminComponent } from "./admin/admin.component";
import { TrackListComponent } from "./track-list/track-list.component";
import { TrackEditorComponent } from "./track-editor/track-editor.component";
import { ReversePipe } from "./reverse-pipe/reverse.pipe";
import { InputManagerService } from "./input-manager-service/input-manager.service";

@NgModule({
    declarations: [
        AppComponent,
        GameComponent,
        CrosswordsComponent,
        PlayermodeComponent,
        HomePageComponent,
        AdminComponent,
        TrackListComponent,
        TrackEditorComponent,
        ReversePipe
    ],
    imports: [
        BrowserModule,
        HttpClientModule,
        AppRoutingModule,
        FormsModule
    ],
    providers: [InputManagerService],
    bootstrap: [AppComponent]
})
export class AppModule { }
