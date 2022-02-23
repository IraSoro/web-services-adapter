export class Service {
    constructor() {
        if (this.constructor === Service) {
            throw Error("BaseService is abstract class");
        }
    }

    async check() {
        throw Error("Virtual function 'check' not implemented");
    }
    
    async exec() {
        throw Error("Virtual function 'exec' not implemented");
    }
}
