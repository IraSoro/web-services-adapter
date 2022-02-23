import assert from "assert";

import {
    describe,
    it
} from "mocha";

import { Config } from "../../core/config.js";
import { Telegram } from "../../core/services/telegram/telegram.js";
import { Scheduler } from "../../core/apps/scheduler/scheduler.js";

describe("Scheduled Telegram message", () => {
    let cfg = null;
    let telegramConfig = null;

    let telegram = null;
    let dateTime = null;

    it("Parse test-config.yml file", () => {
        cfg = new Config("./test/test-config.json");
    });

    it("Get configuration files", () => {
        telegramConfig = cfg.getConfigForService("telegram");
    });

    it("Set up Telegram", async () => {
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
            message: telegramConfig.message
        });
    });

    it("Set up the Scheduler to send a message after 2 seconds", () => {
        dateTime = new Scheduler();
        dateTime.setTrigger("DateTime", {
            dateTime: new Date().getTime() + 2000
        });
    });

    it("Execution", async () => {
        await dateTime.exec();
        await telegram.exec();
    });

    it("Set up the Scheduler to send a message after 2 seconds", () => {
        dateTime.setTrigger("DateTime", {
            dateTime: new Date().getTime() + 2000
        });
    });

    it("Execution with canceled timeout", async () => {
        await dateTime.cancel();
        const start = new Date();
        await dateTime.exec();
        await telegram.exec();
        assert(new Date() - start < 2000, "Waiting too long");
    });
});
