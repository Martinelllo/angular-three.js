import { Component } from '@angular/core';

@Component({
  selector: 'app-hud',
  imports: [],
  templateUrl: './hud.html',
  styleUrl: './hud.scss'
})
export class Hud {

  counter = 0;

  constructor(
  ) { }

  click() {
    if(this.counter >= 10) {
      alert('Cool geklickt!');
      this.counter = 0;
      return;
    }
    this.counter++;
  }
}
