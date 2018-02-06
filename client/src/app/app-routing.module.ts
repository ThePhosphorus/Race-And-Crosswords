import { NgModule } from "@angular/core";
import { RouterModule, Routes } from "@angular/router";
import { GameComponent } from "./game-component/game.component";
import { CrosswordsComponent } from "./crosswords-component/crosswords.component";
import { HomePageComponent } from "./home-page/home-page.component";
import { AdminComponent } from "./admin/admin.component";
import { TrackListComponent } from "./track-list/track-list.component";

const routes: Routes = [
  { path: "" , redirectTo: "/home-page", pathMatch: "full" },
  { path : "home-page", component: HomePageComponent},
  { path: "race", component: GameComponent },
  { path: "crosswords", component: CrosswordsComponent },
  { path: "admin", component: AdminComponent,
    children: [
        { path: "" , redirectTo: "track-list", pathMatch: "full" },
        { path : "track-list", component: TrackListComponent}
    ] }
];

@NgModule({
  exports: [ RouterModule ],
  imports: [ RouterModule.forRoot(routes) ],
})
export class AppRoutingModule {}
