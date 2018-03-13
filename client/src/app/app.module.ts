import { BrowserModule } from "@angular/platform-browser";
import { NgModule } from "@angular/core";
import { HttpClientModule } from "@angular/common/http";
import { FormsModule } from "@angular/forms";
import { AppComponent } from "./app.component";
import { AppRoutingModule } from "./app-routing.module";
import { HomePageComponent } from "./home-page/home-page.component";
import { ReversePipe } from "./reverse-pipe/reverse.pipe";
import { GameComponent } from "./race/game-component/game.component";
import { TrackEditorComponent } from "./race/admin/track-editor/track-editor.component";
import { TrackListComponent } from "./race/admin/track-list/track-list.component";
import { AdminComponent } from "./race/admin/admin.component";
import { InputManagerService } from "./race/input-manager-service/input-manager.service";
import { CrosswordsComponent } from "./crossword/crosswords-component/crosswords.component";
import { CrosswordGameInfoComponent } from "./crossword/crossword-game-info/crossword-game-info.component";
import { InputGridComponent } from "./crossword/input-grid/input-grid.component";
import { DefinitionComponent } from "./crossword/definition/definition.component";
import { InputLetterComponent } from "./crossword/input-letter/input-letter.component";
import { ModalNewGameComponent } from "./crossword/crossword-game-info/modal-new-game/modal-new-game.component";

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
        InputLetterComponent,
        ModalNewGameComponent
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
