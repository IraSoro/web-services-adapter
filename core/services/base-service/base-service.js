export class BaseService {
    constructor(name) {
        if (this.constructor === BaseService) {
            throw Error("BaseService is abstract class");
        }
        this._name = name;
    }

    get name() {
        return this._name;
    }

    get commands() {
        throw Error("Virtual get-method 'commands' not implemented");
    }

    async test() {
        throw Error("Virtual function 'check' not implemented");
    }
}
