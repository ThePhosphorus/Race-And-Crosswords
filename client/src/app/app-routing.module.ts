import { NgModule } from "@angular/core";
import { RouterModule, Routes } from "@angular/router";
import { GameComponent } from "./game-component/game.component";
import { CrosswordsComponent } from "./crosswords-component/crosswords.component";
import { HomePageComponent } from "./home-page/home-page.component";
import { AdminComponent } from "./admin/admin.component";
import { TrackListComponent } from "./track-list/track-list.component";
import { TrackEditorComponent } from "./track-editor/track-editor.component";

const routes: Routes = [
  { path: "" , redirectTo: "/home-page", pathMatch: "full" },
  { path : "home-page", component: HomePageComponent},
  { path: "race", component: GameComponent },
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
