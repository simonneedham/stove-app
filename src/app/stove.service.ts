import { Injectable, OnDestroy } from '@angular/core';
import { HttpClient } from '@angular/common/http';

import { Observable } from 'rxjs/Observable';
import { ErrorObservable } from 'rxjs/observable/ErrorObservable';
import { Subject } from 'rxjs/Subject';
import { BehaviorSubject } from 'rxjs/BehaviorSubject';
import 'rxjs/add/observable/interval';
import 'rxjs/add/observable/of';
import { catchError, flatMap, map, share, takeUntil } from 'rxjs/operators';

import { BurnLevel } from './burnLevel';
import { Stove } from './stove';
import { StoveData } from './stoveData';
import { SettingsService } from './settings.service';

@Injectable()
export class StoveService implements OnDestroy {

    public selectedStove: BehaviorSubject<Stove>;
    public stoveStatus = new Observable<StoveData>();

    private lastSelectedStove: Stove;
    private statusUrl = 'get_stove_data';
    private completionSubject = new Subject();

    constructor(
        private httpClient: HttpClient,
        private settings: SettingsService
    ) {
        this.lastSelectedStove = this.settings.lastStove;
        this.selectedStove = new BehaviorSubject<Stove>(this.lastSelectedStove);

        const tick = Observable.interval(10000);
        this.stoveStatus = tick
                .pipe(
                    flatMap(() => this.httpClient.get<StoveData>(
                        `http://${this.lastSelectedStove.ip}/${this.statusUrl}`)
                    ),
                    catchError(this.handleStoveStatusError),
                    share(),
                    takeUntil(this.completionSubject)
                );
    }

    public setBurnLevel(burnLevel: 0|1|2|3|4|5): Observable<boolean> {
        return this
            .httpClient
            .post(
                `http://${this.lastSelectedStove.ip}/set_burn_level`,
                { 'level': burnLevel },
                {
                    headers: {
                        'content-type': 'text/plain'
                    },
                    // observe: 'response',
                    responseType: 'text'
                }
            )
            .pipe(
                catchError(this.handleError),
                takeUntil(this.completionSubject)
            );
    }

    public getIdentification(ipAddress: string): Observable<Stove> {
        return this
            .httpClient
            .get<Stove>(`http://${ipAddress}/esp/get_identification`)
            .pipe(
                catchError(this.handleError),
                takeUntil(this.completionSubject)
            );
    }

    public selectStove(ipAddress?: string) {
        if (this.settings.stoveIdRequestEnabled) {
            const ipToUse = ipAddress || this.settings.lastStove.ip;

            this.getIdentification(ipToUse)
                .pipe(
                    share(),
                    catchError(this.handleError),
                    takeUntil(this.completionSubject)
                )
                .subscribe(s => {
                    this.lastSelectedStove = s || this.lastSelectedStove;
                    this.selectedStove.next(s);
                });
        } else {
            console.log('Get Ident disabled.');
            console.log(this.settings.lastStove);
            this.selectedStove.next(this.settings.lastStove);
        }
    }

    private handleError(err: any) {
        console.log(err); // log for devs
        return ErrorObservable.create(err);
    }

    private handleStoveStatusError(err: any) {
        console.log(err); // log for devs
        return Observable.of(new StoveData());
    }

    public ngOnDestroy(): void {
        this.completionSubject.next();
        this.completionSubject.complete();
    }
}
