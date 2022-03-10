import express from "express";
import { Telegraf } from "telegraf";
import fetch from "node-fetch";

import { App, Command } from "./app.js";


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

    createCommand(name, args) {
        switch (name) {
            case "SendMessage":
                return new SendMessage(this._ctx, args);
            default:
                throw new Error("Unknown command");
        }
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
