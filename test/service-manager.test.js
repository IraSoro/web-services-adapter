import assert from "assert";

import {
    describe,
    it
} from "mocha";

import { ServiceManager } from "../core/service-manager.js";


describe("Service Manager", () => {
    it("There must be a Telegram service", () => {
        assert.notEqual(ServiceManager.createService("Telegram"), null);
    });

    it("Should give an error to an unknown service name", () => {
        assert.throws(() => ServiceManager.createService("UnknownServiceName"));
    });
});

