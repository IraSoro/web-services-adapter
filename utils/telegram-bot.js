import fs from "fs";

import fetch from "node-fetch";
import { Telegraf } from "telegraf";

import { cfgManager } from "../core/cfg-manager.js";


export class TelegramBot {
    constructor() {
        this.__ctx = cfgManager.getAppContext("Telegram");
        this.__token = this.__ctx["token"];
        this.__bot = new Telegraf(this.__token);

        this.__setupCommands();
    }

    __setupCommands() {
        this.__bot.start((ctx) => {
            const replyMsg = `Hello @${ctx.message.chat.username} \n`
                + `You chat id is ${ctx.message.chat.id}`;
            ctx.reply(replyMsg);
        });

        this.__bot.help((ctx) => {
            // TODO @imblowfish: реализуй меня
            ctx.reply("Help message");
        });

        this.__bot.command("connect", async (ctx) => {
            try {
                const response = await fetch(this.__ctx["redirectURI"], {
                    method: "POST",
                    headers: {
                        "Accept": "application/json",
                        "Content-Type": "application/json"
                    },
                    body: JSON.stringify({
                        chatID: ctx.message.chat.id
                    })
                });
                const json = await response.json();
                ctx.reply(`Successfully connected ${JSON.stringify(json)}`);
            } catch (err) {
                console.error("Failed", JSON.stringify(err));
            }

        });
    }

    async launch() {
        await this.__bot.launch();
    }

    stop() {
        this.__bot.stop();
    }
}
