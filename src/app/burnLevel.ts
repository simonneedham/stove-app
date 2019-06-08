export class BurnLevel {
    level: 0|1|2|3|4|5;

    constructor(init?: Partial<BurnLevel>) {
        Object.assign(this, init);
    }
}
