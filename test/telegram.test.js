import process from "process";
import assert from "assert";

import {
    describe,
    it
} from "mocha";
import { Telegram } from "../core/services/telegram/telegram.js";


const token = process.env.TELEGRAM_TOKEN ?? "";

const service = new Telegram();
service.configure({ token: token });

describe("Telegram", () => {
    it("'TELEGRAM_TOKEN' env variable should be non-empty string", () => {
        assert.notEqual(token.length, 0, "'TELEGRAM_TOKEN' is empty");
    });
    it("'check' function should return status 200", async () => {
        try {
            const resp = await service.check();
            assert.equal(resp.status, 200);
        } catch (err) {
            const strError = JSON.stringify(await err.json());
            assert.fail(strError);
        }
    });
    it("should send telegram message", async () => {
        try {
            await service.exec();
        } catch (err) {
            assert.fail(new Error(err));
        }
    });
});
