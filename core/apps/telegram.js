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
    constructor(ctx) {
        super(ctx);
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
