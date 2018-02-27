import { BrowserModule } from "@angular/platform-browser";
import { NgModule } from "@angular/core";
import { HttpClientModule } from "@angular/common/http";
import { FormsModule } from "@angular/forms";
import { AppComponent } from "./app.component";
import { AppRoutingModule } from "./app-routing.module";
import { CrosswordsComponent } from "./crosswords-component/crosswords.component";
import { CrosswordGameInfoComponent } from "./crossword-game-info/crossword-game-info.component";
import { HomePageComponent } from "./home-page/home-page.component";
import { ReversePipe } from "./reverse-pipe/reverse.pipe";
import { InputGridComponent } from "./input-grid/input-grid.component";
import { DefinitionComponent } from "./definition/definition.component";
import { InputLetterComponent } from "./input-letter/input-letter.component";
import { GameComponent } from "./race/game-component/game.component";
import { TrackEditorComponent } from "./race/admin/track-editor/track-editor.component";
import { TrackListComponent } from "./race/admin/track-list/track-list.component";
import { AdminComponent } from "./race/admin/admin.component";
import { InputManagerService } from "./race/input-manager-service/input-manager.service";

@NgModule({
    declarations: [
        AppComponent,
        GameComponent,
        CrosswordsComponent,
        CrosswordGameInfoComponent,
        HomePageComponent,
        AdminComponent,
        TrackListComponent,
        TrackEditorComponent,
        ReversePipe,
        HomePageComponent,
        InputGridComponent,
        DefinitionComponent,
        InputLetterComponent
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
