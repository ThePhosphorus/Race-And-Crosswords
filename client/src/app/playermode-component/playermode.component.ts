import { Component, OnInit } from '@angular/core';
import {difficlvlEnum} from './difficlvlEnum.ts';  


@Component({
  selector: 'app-playermode',
  templateUrl: './playermode.component.html',
  styleUrls: ['./playermode.component.css']
})
export class PlayermodeComponent implements OnInit {

   public noPlayer: int = 2;
   public lvlEnum = difficlvlEnum;
   public myLvl = difficlvlEnum.Easy;
 

  constructor() { }

  

  ngOnInit() :void {
  }

}
