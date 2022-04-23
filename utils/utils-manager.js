import { TelegramBot } from "./telegram-bot.js";


class UtilsManager {
    constructor() {
        this.__utils = {
            "Telegram Bot": new TelegramBot()
        };
    }

    async launchAll() {
        for (const [name, util] of Object.entries(this.__utils)) {
            console.log("Launch util", name);
            await util.launch();
        }
    }
}

export const utilsManager = new UtilsManager();
