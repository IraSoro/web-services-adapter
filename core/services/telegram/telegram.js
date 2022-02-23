import { Telegraf } from "telegraf";
import fetch from "node-fetch";

import { BaseService } from "../base-service/base-service.js";


export class Telegram extends BaseService {
    constructor(ctx) {
        super("Telegram");

        this.__token = ctx.token;
        this.__bot = new Telegraf(this.__token);
    }

    get commands() {
        return [
            "Send Message"
        ];
    }

    async test() {
        try {
            const url = `https://api.telegram.org/bot${this.__token}/getMe`;
            const resp = await fetch(url);
            if (resp.status === 200) {
                return Promise.resolve(resp);
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
