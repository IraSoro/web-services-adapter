import { Telegraf } from "telegraf";
import fetch from "node-fetch";

import { Service } from "../service.js";


export class Telegram extends Service {
    constructor(ctx) {
        super();

        this.__token = ctx.token;
        this.__bot = new Telegraf(this.__token);
    }

    async check() {
        try {
            const url = `https://api.telegram.org/bot${this.__token}/getMe`;
            const resp = await fetch(url);
            if (resp.status === 200) {
                return resp;
            }
            return Promise.reject(resp);
        } catch (err) {
            return Promise.reject(err);
        }
    }

    async exec() {
        return this.__bot.telegram.sendMessage("354968032", "Helloooooo");
    }
}
