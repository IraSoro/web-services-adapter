import express from "express";
// import fetch from "node-fetch";

import cron from "node-cron";

import {
    App,
    Trigger
} from "./app.js";


class Timing extends Trigger {
    constructor(ctx, args) {
        super(ctx, args);
    }

    getFn() {        
        return async (cb) => {
            const res = cron.schedule("1 * * * *", () => {
                console.log("running every minute 1");
            });
            cb(res);
        };
    }
}

export class Cron extends App {
    constructor() {
        super("Cron");

        this._triggers = {
            "Timing": Timing
        };

    }

    getRouter() {
        const router = express.Router();

        router.post("/cron/status", (_, res) => res.status(200).json({ connected: true }));

        return router;
    }

    async check() {

    }
}
