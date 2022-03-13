import { GoogleCalendar } from "../apps/google.js";
import { Scheduler } from "../apps/scheduler.js";
import { Telegram } from "../apps/telegram.js";


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
                icon: properties.icon,
                connected: properties.instance.isAlreadyConnected(),
                authURL: properties.instance.getAuthURL(),
                commands: properties.instance.getCommands(),
                triggers: properties.instance.getTriggers()
            });
        }
        return apps;
    }

    getAppByName(appName) {
        for (const app of this.apps) {
            if (app.name == appName) {
                return app;
            }
        }
        return null;
    }

    getAppInstance(appName) {
        if (Object.keys(this.__apps).includes(appName)) {
            return this.__apps[appName].instance;
        }
        throw new UnknownApplicationError(appName);
    }
}

export const appsManager = new AppsManager();
