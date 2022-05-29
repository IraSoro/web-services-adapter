import express from "express";
import { Telegraf } from "telegraf";
import fetch from "node-fetch";

import { createSubscriber } from "../utils/fastmq.js";
import { Users } from "../storages.js";
import {
    App,
    Action,
    Trigger
} from "./app.js";


class ReceiveMessage extends Trigger {
    constructor(ctx, args) {
        super(ctx, args);
    }

    getFn() {
        return async (cb) => {
            const p = new Promise((resolve, reject) => {
                createSubscriber("telegram-bot")
                    .then((channel) => {
                        channel.subscribe("message", (msg) => {
                            if (msg.payload.chatID != this._args.chatID
                                || msg.payload.text != this._args.message) {
                                return;
                            }
                            channel.disconnect();
                            resolve(msg);
                        });
                    })
                    .catch((err) => {
                        reject(err);
                    });
            });
            const result = await p;
            cb(result);
        };
    }
}

class SendMessage extends Action {
    constructor(ctx, args) {
        super(ctx, args);
    }

    getFn() {
        return async (cb) => {
            const bot = new Telegraf(this._ctx.token);
            const res = await bot.telegram.sendMessage(this._args.chatID, this._args.message);
            cb(res);
        };
    }
}

export class Telegram extends App {
    constructor() {
        super("Telegram");

        this._triggers = {
            "Receive Message": ReceiveMessage
        };

        this._actions = {
            "Send Message": SendMessage
        };
    }

    isAlreadyConnected() {
        /* 
         * NOTE @imblowfish: Если в контексте нет chatID пользователя,
         * значит пользователь не авторизован
         */
        if ("chatID" in this._ctx) {
            return Boolean(this._ctx.chatID);
        }
        return false;
    }

    getAuthType() {
        return "APIToken";
    }

    getAuthURL() {
        return this._ctx.botURL;
    }

    getRouter() {
        const router = new express.Router();

        router.get("/telegram/authcallback", (req, res) => {
            const user = Users.by("uuid", req.session.uuid);
            if (!user) {
                return res.status(401).json({
                    message: "Unknown user, authorize"
                });
            }
            user.accounts["Telegram"] = JSON.parse(JSON.stringify({
                username: req.query.username,
                chatID: req.query.chatID,
            }));
            Users.update(user);
            res.redirect("/");
        });

        router.post("/telegram/status", (req, res) => {
            let connected = false;
            if (req.session.uuid) {
                const user = Users.by("uuid", req.session.uuid);
                connected = !!user.accounts["Telegram"];
            } else {
                const users = Users.where((user) => {
                    const telegram = user.accounts["Telegram"];
                    return telegram && telegram.chatID == req.body.chatID
                        && telegram.username == req.body.username;
                });
                connected = users.length;
            }
            return res.status(200).json({
                connected: connected,
                authURL: this.getAuthURL()
            });
        });

        router.get("/telegram/chats", (req, res) => {
            const user = Users.by("uuid", req.session.uuid);
            if (!user) {
                return res.status(401).json({
                    message: "Unknown user, authorize"
                });
            }
            res.json([
                user?.accounts?.["Telegram"]
            ]);
        });
        return router;
    }

    async check() {
        try {
            const url = `https://api.telegram.org/bot${this._ctx.token}/getMe`;
            const resp = await fetch(url);
            if (resp.status === 200) {
                return resp;
            }
            return Promise.reject(resp);
        } catch (err) {
            return Promise.reject(err);
        }
    }
}
