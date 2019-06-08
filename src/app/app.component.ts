import { Component, OnDestroy, OnInit } from '@angular/core';

import { Observable ,  Subject } from 'rxjs';

import { StoveService } from './stove.service';
import { takeUntil } from 'rxjs/operators';

@Component({
  selector: 'app-root',
  templateUrl: 'app.component.html'
})
export class AppComponent {

  constructor(
    private stoveSvc: StoveService
  ) {
    this.stoveSvc.selectStove();
  }

}
