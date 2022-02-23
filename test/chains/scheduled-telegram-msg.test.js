import assert from "assert";

import {
    describe,
    it
} from "mocha";

import { Config } from "../../core/config.js";
import { Telegram } from "../../core/services/telegram/telegram.js";

describe("Scheduled Telegram message", () => {
    const cfg = new Config("./test/test-config.yml");
    const telegramConfig = cfg.getConfigForService("telegram");

    let telegram = null;

    it("Configure Telegram", async () => {
        telegram = new Telegram(telegramConfig);

        try {
            const resp = await telegram.check();
            assert.equal(resp.status, 200, "Wrong response status");
        } catch (err) {
            const strErr = JSON.stringify(await err.json());
            assert.fail(strErr);
        }

        telegram.setCommand("Send Message", {
            chatID: telegramConfig.chatID,
            msg: telegramConfig.msg
        });
    });

    it("Execution", async () => {
        await telegram.exec();
    });
});
