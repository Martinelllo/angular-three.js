import { Component } from '@angular/core';
import { ControlService } from '../services/control-service';

@Component({
  selector: 'app-hud',
  imports: [],
  templateUrl: './hud.html',
  styleUrl: './hud.scss'
})
export class Hud {
  constructor(
    public controlService: ControlService,
  ) { }
}
