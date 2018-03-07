import { Component, OnInit } from '@angular/core';
import { GameManagerService, CarInfos } from '../../game-component/game-manager-service/game_manager.service';

@Component({
  selector: 'app-rpm-bar',
  templateUrl: './rpm-bar.component.html',
  styleUrls: ['./rpm-bar.component.css']
})
export class RpmBarComponent implements OnInit {

  constructor(private _gameManagerService: GameManagerService) { }

  ngOnInit() {
  }

  public get speed(): number {
    return Math.round(this._gameManagerService.carInfos.speed * 3.6);
  }

  public get rpm(): number {
    return Math.round(this._gameManagerService.carInfos.rpm);
  }
}
