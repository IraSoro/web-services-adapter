import fs from "fs";

import { GoogleCalendar } from "./apps/google.js";
import { Scheduler } from "./apps/scheduler.js";
import { Telegram } from "./apps/telegram.js";


class UnknownApplicationError extends Error {
    constructor(unknownAppName) {
        const msg = `Unknown application name, ${unknownAppName}`;
        super(msg);
        this.name = "UnknownApplicationError";
    }
}

class AppsManager {
    constructor() {
        this.__apps = {
            "Google Calendar": {
                instance: new GoogleCalendar(),
                icon: "icons8-google-calendar-48.png"
            },
            "Scheduler": {
                instance: new Scheduler(),
                icon: "icons8-blank-48.png"
            },
            "Telegram": {
                instance: new Telegram(),
                icon: "icons8-telegram-app-48.png"
            }
        };

        this.__check();
    }

    __check() {
        for (const appName of Object.keys(this.__apps)) {
            try {
                fs.accessSync(this.getAppIcon(appName));
            } catch (err) {
                throw new UnknownApplicationError(appName);
            }
        }
    }

    initRoutes(expressApp) {
        console.log("Initialize applications routes");
        for (const appName of Object.keys(this.__apps)) {
            expressApp.use(this.getAppInstance(appName).getRouter());
        }
    }

    getSupportedApps() {
        return Object.keys(this.__apps);
    }

    getAppInstance(appName) {
        if (Object.keys(this.__apps).includes(appName)) {
            return this.__apps[appName].instance;
        }
        throw new UnknownApplicationError(appName);
    }

    getAppIcon(appName) {
        const iconsPath = "./core/apps/icons/";
        if (Object.keys(this.__apps).includes(appName)) {
            return iconsPath + this.__apps[appName].icon;
        }
        throw new UnknownApplicationError(appName);
    }
}

export const appsManager = new AppsManager();
