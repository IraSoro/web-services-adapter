export class Command {
    constructor(ctx, args) {
        this._ctx = ctx;
        this._args = args;
    }

    async exec() {
    }
}

export class App {
    constructor(ctx) {
        this._ctx = ctx;
    }

    getAuthType() {
    }

    getAuthURL() {
    }

    createTrigger(name, args) {
        name;
        args;
    }

    createCommand(name, args) {
        name;
        args;
    }

    async auth(callback) {
        callback;
    }

    async check() {
    }
}
