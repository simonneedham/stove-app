import { Injectable } from '@angular/core';

import { Stove } from './stove';

@Injectable()
export class SettingsService {

    constructor() { }

    public get lastStove(): Stove {
        let storedStove: Stove = JSON.parse(localStorage.getItem('lastStove'));
        if (!storedStove || !storedStove.ip) {
            storedStove = { name: 'Living Room', ip: '192.168.1.4'};
        }

        return new Stove(storedStove);
    }

    public set lastStove(val: Stove) {
        localStorage.setItem('lastStove', JSON.stringify(val));
    }

    public get stoveIdRequestEnabled(): boolean {
        const enabled = localStorage.getItem('stoveIdRequestEnabled');
        return enabled === 'true';
    }

    public set stoveIdRequestEnabled(val: boolean) {
        localStorage.setItem('stoveIdRequestEnabled', JSON.stringify(val));
    }
}



