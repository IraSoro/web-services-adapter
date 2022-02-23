export class Scheduler {
    constructor() {
        this.timeouts = [];

        this.triggers = {
            "DateTime": async (ctx) => {
                const currentDateTime = new Date();
                const schedulerDateTime = new Date(ctx.dateTime);

                if (!schedulerDateTime) {
                    Promise.reject("Wrong date syntax");
                }

                if (schedulerDateTime - currentDateTime <= 0) {
                    return Promise.resolve();
                }

                return new Promise((resolve) => {
                    this.timeouts.push(setTimeout(resolve, schedulerDateTime - currentDateTime));
                });
            }
        };
    }

    supportedTriggers() {
        return Object.keys(this.triggers);
    }

    setTrigger(name, ctx) {
        if (name in this.triggers) {
            this.trigger = () => this.triggers[name](ctx);
            return;
        }
        throw new Error("Unknown trigger");
    }

    async check() {
        return Promise.resolve();
    }

    async exec() {
        if (!this.trigger) {
            return Promise.reject("Trigger is null");
        }
        return this.trigger();
    }

    async cancel() {
        for (const [i, timeout] of Object.entries(this.timeouts)) {
            clearTimeout(timeout);
            this.timeouts.splice(i, 1);
        }
        this.trigger = () => { };
    }
}
