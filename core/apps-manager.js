import fs from "fs";

import { IconsManager } from "./icons-manager.js";
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
                icon: IconsManager.convertPath("icons8-google-calendar-48.png")
            },
            "Scheduler": {
                instance: new Scheduler(),
                icon: IconsManager.convertPath("icons8-blank-48.png")
            },
            "Telegram": {
                instance: new Telegram(),
                icon: IconsManager.convertPath("icons8-telegram-app-48.png")
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

    get apps() {
        const apps = [];
        for (const [appName, properties] of Object.entries(this.__apps)) {
            apps.push({
                name: appName,
                connected: properties.instance.isAlreadyConnected()
            });
        }
        return apps;
    }
    
    getAppInfo(appName) {
        if (Object.keys(this.__apps).includes(appName)) {
            return {
                name: appName,
                connected: this.__apps[appName].instance.isAlreadyConnected()
            };
        }
        throw new UnknownApplicationError(appName);
    }

    getAppIcon(appName) {
        if (Object.keys(this.__apps).includes(appName)) {
            return this.__apps[appName].icon;
        }
        throw new UnknownApplicationError(appName);
    }

    getAppInstance(appName) {
        if (Object.keys(this.__apps).includes(appName)) {
            return this.__apps[appName].instance;
        }
        throw new UnknownApplicationError(appName);
    }
}

export const appsManager = new AppsManager();
