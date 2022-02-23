export class Service {
    constructor(name) {
        if (this.constructor === Service) {
            throw Error("BaseService is abstract class");
        }
        this.__name = name;
        this._configured = false;
    }

    getName() {
        return this.__name;
    }

    configure(cfg) {
        cfg;
        throw Error("Virtual function 'configure' not implemented");
    }

    async check() {
        throw Error("Virtual function 'check' not implemented");
    }

    async exec() {
        throw Error("Virtual function 'exec' not implemented");
    }
}
