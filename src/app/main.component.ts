import { Component, OnInit } from '@angular/core';
import { StoveService } from './stove.service';
import { SettingsService } from './settings.service';

@Component({
    selector: 'app-main',
    template: `
<app-title-bar></app-title-bar>

<app-centre-info></app-centre-info>

<app-burn-level></app-burn-level>
    `
})

export class MainComponent {
    constructor() { }
}

