import process from "process";

import { Telegraf } from "telegraf";

const token = process.env.TELEGRAM_TOKEN ?? "";
const bot = new Telegraf(token);

bot.start((ctx) => {
    const replyMsg = `Hello @${ctx.message.chat.username} \n`
        + `You chat id is ${ctx.message.chat.id}`;
    ctx.reply(replyMsg);
});

bot.help((ctx) => {
    // TODO @imblowfish: реализуй меня
    ctx.reply("Help message");
});


bot.launch();
console.log("Launched");

process.once("SIGINT", () => {
    console.log("Stop bot with SIGINT signal");
    bot.stop("SIGINT");
});
process.once("SIGTERM", () => {
    console.log("Stop bot with SIGTERM signal");
    bot.stop("SIGTERM");
});
