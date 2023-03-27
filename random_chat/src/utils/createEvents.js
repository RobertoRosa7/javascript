export default class CreateEvent {
    constructor() {
        this.events = {};
    }

    on(name, fn) {
        if (!this.events[name]) this.events[name] = new Array();
        this.events[name].push(fn);
    }
    trigger() {
        let args = [...arguments];
        let name = args.shift();

        args.push(new Event(name));

        if (this.events[name] instanceof Array) {
            this.events[name].forEach((fn) => {
                fn.apply(null, args);
            });
        }
    }
}
