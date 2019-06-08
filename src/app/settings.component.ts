import { Component, OnInit } from '@angular/core';

import { SettingsService } from './settings.service';
import { FormBuilder, FormGroup } from '@angular/forms';
import { Router } from '@angular/router';

@Component({
    selector: 'app-settings',
    templateUrl: 'settings.component.html'
})

export class SettingsComponent implements OnInit {
    public formGroup: FormGroup;

    constructor(
        private settingsService: SettingsService,
        private formBuilder: FormBuilder,
        private router: Router
    ) { }

    ngOnInit() {
        const settings = {
            lastStove: this.settingsService.lastStove,
            stoveIdRequestEnabled: this.settingsService.stoveIdRequestEnabled
        };

        this.formGroup = this.formBuilder.group({
            lastStove: this.formBuilder.group(this.settingsService.lastStove),
            stoveIdRequestEnabled: this.settingsService.stoveIdRequestEnabled
        });
    }

    public saveOnClick() {
        const settings = this.formGroup.value;

        this.settingsService.lastStove = settings.lastStove;
        this.settingsService.stoveIdRequestEnabled = settings.stoveIdRequestEnabled;

        this.router.navigate(['/']);
    }
}

