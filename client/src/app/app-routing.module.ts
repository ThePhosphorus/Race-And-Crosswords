import { NgModule } from "@angular/core";
import { RouterModule, Routes } from "@angular/router";
import { CrosswordsComponent } from "./crossword/crosswords-component/crosswords.component";
import { HomePageComponent } from "./home-page/home-page.component";
import { GameComponent } from "./race/game-component/game.component";
import { TrackEditorComponent } from "./race/admin/track-editor/track-editor.component";
import { TrackListComponent } from "./race/admin/track-list/track-list.component";
import { AdminComponent } from "./race/admin/admin.component";
import { GameMenuComponent } from "./race/game-menu/game-menu.component";

const routes: Routes = [
  { path: "" , redirectTo: "/home-page", pathMatch: "full" },
  { path : "home-page", component: HomePageComponent},
  { path: "race", component: GameMenuComponent },
  { path: "race/:id", component: GameComponent },
  { path: "crosswords", component: CrosswordsComponent },
  { path: "admin", component: AdminComponent,
    children: [
        { path: "" , redirectTo: "tracks", pathMatch: "full" },
        { path : "tracks", component: TrackListComponent},
        { path: "tracks/new", component: TrackEditorComponent},
        { path: "tracks/:id", component: TrackEditorComponent}
    ] }
];

@NgModule({
  exports: [ RouterModule ],
  imports: [ RouterModule.forRoot(routes) ],
})
export class AppRoutingModule {}
