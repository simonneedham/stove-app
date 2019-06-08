export class Stove {
    name: string;
    ip: string;

    constructor(init?: Partial<Stove>) {
        Object.assign(this, init);
    }
}
