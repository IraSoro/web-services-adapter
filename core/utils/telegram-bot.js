import fetch from "node-fetch";
import { Telegraf } from "telegraf";

import { getConfig } from "../cfg.js";
import { createChannel } from "./fastmq.js";


export class TelegramBot {
    constructor() {
        this.__ctx = getConfig("Telegram");
        this.__token = this.__ctx["token"];
        this.__bot = new Telegraf(this.__token);
        this.__channel = null;

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
            const addr = `http://${getConfig("Settings").host}:${getConfig("Settings").port}`;
            const redirectURI = addr + this.__ctx.redirectURI;
            const username = ctx.message.chat.username;
            const chatID = ctx.message.chat.id;

            const resp = await fetch(addr + this.__ctx.statusURI, {
                method: "POST",
                headers: {
                    "Accept": "application/json",
                    "Content-Type": "application/json"
                },
                body: JSON.stringify({
                    chatID: chatID,
                    username: username
                })
            });

            const json = await resp.json();

            if (!json.connected) {
                const followLink = `${redirectURI}?app=Telegram&chatID=${chatID}&username=${username}`;
                ctx.reply(`Please follow this link to connect ${followLink}`);
            } else {
                ctx.reply("Already connected");
            }
        });

        this.__bot.on("message", (ctx) => {
            this.__channel?.publish("subscriber.*", "message", {
                chatID: ctx.chat.id,
                text: ctx.message.text
            }, "json");
        });
    }

    async launch() {
        this.__channel = await createChannel("publisher", "telegram-bot");
        await this.__bot.launch();
    }

    stop() {
        this.__bot.stop();
    }
}
