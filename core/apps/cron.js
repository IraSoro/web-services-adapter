import express from "express";
import cron from "node-cron";

import {
    App,
    Trigger
} from "./app.js";


class OnSchedule extends Trigger {
    constructor(ctx, args) {
        super(ctx, args);
    }

    getFn() {        
        return async (cb) => {
            const p = new Promise((resolve) => {
                cron.schedule(this._args.timing, () => {
                    resolve();
                });
            });
            await p;
            cb(true);
        };
    }
}

export class Cron extends App {
    constructor() {
        super("Cron");

        this._triggers = {
            "On Schedule": OnSchedule
        };

    }

    isAlreadyConnected() {
        return true;
    }

    getRouter() {
        const router = express.Router();

        router.post("/cron/status", (_, res) => res.status(200).json({ connected: true }));

        return router;
    }
}
