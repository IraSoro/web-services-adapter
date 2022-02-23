export class Service {
    constructor(name) {
        if (this.constructor === Service) {
            throw Error("BaseService is abstract class");
        }
        this.__name = name;
    }

    get name() {
        return this.__name;
    }

    async check() {
        throw Error("Virtual function 'check' not implemented");
    }

    async exec() {
        throw Error("Virtual function 'exec' not implemented");
    }
}
