import {
    App,
    Command,
    UnknownTriggerError
} from "./app.js";


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
    constructor() {
        super("Scheduler");
    }

    createTrigger(triggerName, args) {
        switch (triggerName) {
            case "OnDateTime":
                return new OnDateTime(this._ctx, args);
            default:
                throw new UnknownTriggerError(this._name, triggerName);
        }
    }

    async check() {
        return Promise.resolve();
    }
}
