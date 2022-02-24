import fs from "fs";
import assert from "assert";

import {
    describe,
    it
} from "mocha";

import { Telegram } from "../core/apps/telegram.js";
import { Scheduler } from "../core/apps/scheduler.js";


describe("Scheduled Telegram message", () => {
    const cfg = JSON.parse(fs.readFileSync("./test/test-config.json", "utf-8"));
    let telegram = null;

    it("Set up Telegram", async () => {
        telegram = new Telegram(cfg["telegram"]["cfg"]);
        try {
            const resp = await telegram.check();
            assert.equal(resp.status, 200, "Incorrect return code");
        } catch (err) {
            const strErr = JSON.stringify(await err.json());
            assert.fail(strErr);
        }
    });

    it("Send Telegram message after 2 seconds", async () => {
        const scheduler = new Scheduler();
        const trigger = scheduler.createTrigger("DateTime", {
            dateTime: new Date().getTime() + 2000
        });
        const telegramCmd = telegram.createCommand("SendMessage", cfg["telegram"]["args"]);

        const startTime = new Date();
        await trigger.exec();
        await telegramCmd.exec();
        const endTime = new Date();
        assert(endTime - startTime > 2000,
            `Incorrect time, expected 2000, actual ${endTime - startTime}`);
    });
});
