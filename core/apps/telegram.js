import express from "express";
import { Telegraf } from "telegraf";
import fetch from "node-fetch";

import {
    App,
    Command
} from "./app.js";


class ReceiveMessage extends Command {
    constructor(ctx, args) {
        super(ctx, args);
    }

    async exec() {
        return Promise((resolve) => {
            const bot = new Telegraf(this._ctx.token);
            bot.on("message", (ctx) => {
                resolve(ctx.message.text);
            });
        });
    }
}

class SendMessage extends Command {
    constructor(ctx, args) {
        super(ctx, args);
    }

    async exec() {
        const bot = new Telegraf(this._ctx.token);
        return bot.telegram.sendMessage(this._args.chatID, this._args.message);
    }
}

export class Telegram extends App {
    constructor() {
        super("Telegram");

        this._triggers = {
            "ReceiveMessage": ReceiveMessage
        };

        this._commands = {
            "SendMessage": SendMessage
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
        router.post("/telegram/authcallback", (req, res) => {
            if (req.body.chatID) {
                if (this._ctx.chatID == req.body.chatID) {
                    res.json({
                        res: "Success",
                        msg: "Already connected"
                    });
                    return;
                }
                this._ctx.chatID = req.body.chatID;
                res.json({
                    res: "Success"
                });
            } else {
                res.json({
                    res: "Failed",
                    description: "Invalid auth callback param",
                    reason: "chatID is undefined"
                });
            }
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
