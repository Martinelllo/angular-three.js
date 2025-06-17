import { Injectable } from '@angular/core';

const CONTROL_SERVICE_EVENTS = [
  'start',
  'reset',
] as const

export type ControlServiceEvent = typeof CONTROL_SERVICE_EVENTS[number];

interface Callback {
  event: ControlServiceEvent
  callback: () => {}
};

@Injectable({
  providedIn: 'root'
})
export class ControlService {

  private _callbacks: Callback[] = [];

  constructor() { }

  on(event: ControlServiceEvent, callback: () => any): number {
    return this._callbacks.push({event, callback});
  }

  remove(id: number): void {
    this._callbacks.splice(id, 1)
  }

  trigger(event:ControlServiceEvent): void {
    for (const callback of this._callbacks) {
      if (callback.event === event) {
        callback.callback()
      }
    }
  }
}
