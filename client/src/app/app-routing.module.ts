import { NgModule } from "@angular/core";
import { RouterModule, Routes } from "@angular/router";
import { GameComponent } from "./game-component/game.component";
import { CrosswordsComponent } from "./crosswords-component/crosswords.component";

const routes: Routes = [
  { path: "race", component: GameComponent },
  { path: "crosswords", component: CrosswordsComponent }
];

@NgModule({
  exports: [ RouterModule ],
  imports: [ RouterModule.forRoot(routes) ],
})
export class AppRoutingModule {}
