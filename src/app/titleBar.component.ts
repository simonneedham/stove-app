import { Component, OnDestroy, OnInit } from '@angular/core';

import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';

import { StoveService } from './stove.service';

@Component({
    selector: 'app-title-bar',
    styleUrls: ['titleBar.component.scss'],
    template: `
<div class="d-flex justify-content-between title-bar">
    <div class="ml-3 p-3"><a class="menu" routerLink="settings"><i class="fa fa-bars" aria-hidden="true"></i></a></div>
    <div class="p-3">{{ stoveName }}</div>
    <div class="mr-3 p-3">
        <i
            class="fa"
            [ngClass]="{'fa-chain-broken': !connected, 'text-danger': !connected, 'fa-link': connected, 'text-success': connected}"
        >
        </i>
    </div>
</div>
    `
})

export class TitleBarComponent implements OnInit, OnDestroy {
    public stoveName = '';
    public connected = false;
    private completionSubject = new Subject();

    constructor(private stoveSvc: StoveService) { }

    ngOnInit() {
        this.stoveSvc
            .selectedStove
            .pipe(takeUntil(this.completionSubject))
            .subscribe(
                s => {
                    this.stoveName = s.name;
                    this.connected = true;
                },
                err => { this.connected = false; console.log(); }
        );
    }

    ngOnDestroy(): void {
        this.completionSubject.next();
        this.completionSubject.complete();
    }
}

