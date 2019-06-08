import { Component, OnDestroy, OnInit } from '@angular/core';
import { StoveService } from './stove.service';
import { Subject } from 'rxjs/Subject';
import { takeUntil } from 'rxjs/operators/takeUntil';


// 0: 0
// 1: 0.2
// 2: 0.4
// 3: 0.6
// 4: 0.8
// 5: 1,0

@Component({
    selector: 'app-burn-level',
    styleUrls: ['burnLevel.component.scss'],
    templateUrl: 'burnLevel.component.html'
})

export class BurnLevelComponent implements OnInit, OnDestroy {
    public burnLevel = 0;
    public roomTemp: number;
    public stoveTemp: number;
    public thermometerClass = 'fa-thermometer-empty';

    private completionSubject = new Subject();

    constructor(private stoveSvc: StoveService) { }

    ngOnInit() {
        this.stoveSvc
            .stoveStatus
            .pipe(takeUntil(this.completionSubject))
            .subscribe(ss => {
                this.burnLevel = ss.burn_level;
                this.roomTemp = ss.room_temperature ? ss.room_temperature / 100 : null;
                this.stoveTemp = ss.stove_temperature ? ss.stove_temperature / 100 : null;

                if (!this.roomTemp) {
                    this.thermometerClass = 'fa-thermometer-empty';
                } else if (this.roomTemp < 19) {
                    this.thermometerClass = 'fa-thermometer-empty';
                } else if (this.roomTemp >= 19 && this.roomTemp < 20) {
                    this.thermometerClass = 'fa-thermometer-quarter';
                } else if (this.roomTemp >= 20 && this.roomTemp < 22) {
                    this.thermometerClass = 'fa-thermometer-half';
                } else if (this.roomTemp >= 22 && this.roomTemp < 23) {
                    this.thermometerClass = 'fa-thermometer-three-quarters';
                } else if (this.roomTemp >= 23) {
                    this.thermometerClass = 'fa-thermometer-full';
                }
            });
    }

    public updateBurnLevel(increment: number) {
        let newLevel = this.burnLevel + increment;
        newLevel = newLevel < 0 ? 0 : newLevel;

        this.stoveSvc
            .setBurnLevel(newLevel as 0|1|2|3|4|5)
            .subscribe(s => this.burnLevel = newLevel, err => console.log(err));
    }

    ngOnDestroy() {
        this.completionSubject.next();
        this.completionSubject.complete();
    }
}
