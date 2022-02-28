import fs from "fs";
import assert from "assert";

import {
    describe,
    it
} from "mocha";
import open from "open";

import { Telegram } from "../core/apps/telegram.js";
import { Scheduler } from "../core/apps/scheduler.js";
import { GoogleCalendar } from "../core/apps/google.js";


describe("Scheduled Telegram message", () => {
    const cfg = JSON.parse(fs.readFileSync("./test/test-config.json", "utf-8"));
    const telegram = new Telegram(cfg["telegram"]["ctx"]);
    const scheduler = new Scheduler();

    it("Check Telegram connection", async () => {
        try {
            const resp = await telegram.check();
            assert.equal(resp.status, 200, "Incorrect return code");
        } catch (err) {
            const strErr = JSON.stringify(await err.json());
            assert.fail(strErr);
        }
    });

    it("Send Telegram message after 2 seconds", async () => {
        const trigger = scheduler.createTrigger("OnDateTime", {
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

describe("Test Google Calendar", () => {
    const cfg = JSON.parse(fs.readFileSync("./test/test-config.json", "utf-8"));
    const googleCalendar = new GoogleCalendar(cfg["google-calendar"]["ctx"]);
    const telegram = new Telegram(cfg["telegram"]["ctx"]);

    it("Check Telegram connection", async () => {
        try {
            const resp = await telegram.check();
            assert.equal(resp.status, 200, "Incorrect return code");
        } catch (err) {
            const strErr = JSON.stringify(await err.json());
            assert.fail(strErr);
        }
    });

    it("Google Calendar authorization", async () => {
        try {
            await googleCalendar.auth((authURL) => open(authURL));
        } catch (err) {
            assert.fail(String(err));
        }
    });

    it("Check Google Calendar connection", async () => {
        try {
            await googleCalendar.check();
        } catch (err) {
            assert.fail(String(err));
        }
    });

    it("Send message in Telegram on Google Calendar Event", async () => {
        const testCommand = googleCalendar.createTrigger("OnEvent", cfg["google-calendar"]["args"]);
        const telegramCmd = telegram.createCommand("SendMessage", cfg["telegram"]["args"]);

        try {
            await testCommand.exec();
            await telegramCmd.exec();
        } catch (err) {
            assert.fail(String(err));
        }
    });
});
