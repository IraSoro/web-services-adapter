import { Telegraf } from "telegraf";
import fetch from "node-fetch";

export class Telegram {
    constructor(cfg) {
        this.token = cfg.token;
        this.bot = new Telegraf(this.token);

        this.commands = {
            "Send Message": (ctx) => this.bot.telegram.sendMessage(ctx.chatID, ctx.msg)
            // TODO @imblowfish: Сюда добавлять новые команды
        };
        this.command = null;
    }

    supportedCommands() {
        return Object.keys(this.commands);
    }

    setCommand(name, ctx) {
        if (name in this.commands) {
            this.command = () => this.commands[name](ctx);
            return;
        }
        throw new Error("Unknown command");
    }

    async check() {
        try {
            const url = `https://api.telegram.org/bot${this.token}/getMe`;
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
        if (!this.command) {
            return Promise.reject("Command is null");
        }
        return this.command();
    }
}
