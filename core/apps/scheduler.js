import { App, Command } from "./app.js";


class OnDateTime extends Command {
    constructor(ctx, args) {
        super(ctx, args);
    }

    async exec() {
        const currentDateTime = new Date();
        const scheduledDateTime = new Date(this._args.dateTime);

        if (!scheduledDateTime) {
            return Promise.reject("Invalid dateTime");
        }
        if (scheduledDateTime - currentDateTime <= 0) {
            return Promise.resolve();
        }
        return new Promise((resolve) => {
            setTimeout(resolve, scheduledDateTime - currentDateTime);
        });
    }
}

export class Scheduler extends App {
    constructor(ctx) {
        super(ctx);
    }

    createTrigger(name, args) {
        switch (name) {
            case "OnDateTime":
                return new OnDateTime(this._ctx, args);
            default:
                throw new Error("Unknown command");
        }
    }

    async check() {
        return Promise.resolve();
    }
}
