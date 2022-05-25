import express from "express";
import fetch from "node-fetch";

import {
    App,
    Action
} from "./app.js";

class SendRequest extends Action {
    constructor(ctx, args) {
        super(ctx, args);
    }

    getFn() {
        return async (cb) => {
            fetch(this._args.url, {
                method: this._args.method,
                headers: {
                    "Content-Type": this._args.requestType == "JSON"
                        ? "application/json"
                        : "plain/text"
                },
                body: this._args.method == "POST"
                    ? JSON.stringify(this._args.body)
                    : undefined
            })
                .then((resp) => {
                    console.log(resp);
                    cb(resp);
                })
                .catch((err) => {
                    console.error(err);
                    cb(null, err);
                });
        };
    }
}

export class Webhook extends App {
    constructor() {
        super("Webhook");

        this._actions = {
            "Send Request": SendRequest
        };
    }

    isAlreadyConnected() {
        return true;
    }

    getRouter() {
        const router = express.Router();

        router.post("/webhook/status", (_, res) => res.status(200).json({ connected: true }));

        return router;
    }
}
