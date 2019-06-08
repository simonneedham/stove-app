import { Component, OnDestroy, OnInit } from '@angular/core';

import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';

import { StoveService } from './stove.service';

@Component({
    selector: 'app-centre-info',
    styleUrls: ['centreInfo.component.scss'],
    templateUrl: 'centreInfo.component.html'
})

export class CentreInfoComponent implements OnInit, OnDestroy {

    public newFireWoodHours: number;
    public newFireWoodMinutes: number;
    public roomTemp: number;
    public stoveTemp: number;
    public timeToRefill = 'Connecting...';
    public timeToRefillText = 'Connecting...';
    public statusText = 'Connecting';

    private completionSubject = new Subject();
    public phase = -1;

    constructor(private stoveSvc: StoveService) { }

    // phase null: start
    // phase 0: iginition
    // phase 1: burn
    // phase 4: glow
    // phase 5: Start

    ngOnInit() {
        this.statusText = this.getStatusDescrip(this.phase);

        this.stoveSvc
            .stoveStatus
            .pipe(takeUntil(this.completionSubject))
            .subscribe(ss => {
                this.newFireWoodHours = ss.new_fire_wood_hours;
                this.newFireWoodMinutes = ss.new_fire_wood_minutes;

                this.phase = ss.phase;

                switch (this.phase) {
                    case -1:
                        this.timeToRefillText = 'Connecting...';
                        break;
                    case 0:
                    case 5:
                        this.timeToRefillText = 'Calculating...';
                        break;
                    case 1:
                    case 2:
                    case 3:
                        this.timeToRefillText = 'Wait for glowing phase';
                        break;
                    case 4:
                        this.timeToRefillText = null;

                        if (this.newFireWoodHours >= 0 && this.newFireWoodMinutes >= 0) {
                            if (this.newFireWoodHours === 0 && this.newFireWoodMinutes === 0) {
                                this.timeToRefillText = 'Put a log on now!';
                            } else {
                                this.newFireWoodHours = ss.new_fire_wood_hours;
                                this.newFireWoodMinutes = ss.new_fire_wood_minutes;
                            }
                        } else {
                            this.timeToRefill = 'Calculating...';
                        }

                        break;
                    default:
                        return  `Phase ${this.phase}`;
                }

                this.statusText = this.getStatusDescrip(this.phase);

                this.roomTemp = ss.room_temperature ? ss.room_temperature / 100 : null;
                this.stoveTemp = ss.stove_temperature ? ss.stove_temperature / 100 : null;
            });
    }

    private getStatusDescrip(phase: number) {
        switch (this.phase) {
            case -1:
                return 'Connecting';
            case 0:
                return 'Ignition phase';
            case 1:
            case 2:
            case 3:
                return 'Burn phase';
            case 4:
                return 'Glow phase';
            case 5:
                return 'Start';
            default:
                return  `Phase ${this.phase}`;
        }
    }

    ngOnDestroy() {
        this.completionSubject.next();
        this.completionSubject.complete();
    }
}
