import { AfterViewInit, Component, ElementRef, ViewChild, ViewEncapsulation } from '@angular/core';
import { Hud } from './hud/hud';
import { View } from './view/view';

@Component({
  selector: 'app-root',
  templateUrl: './app.html',
  imports: [
    View,
    Hud,
  ],
  styleUrl: './app.scss',
})
export class App {

}
