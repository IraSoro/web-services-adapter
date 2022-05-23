import { TelegramBot } from "./utils/telegram-bot.js";
import { FastMQServer } from "./utils/fastmq.js";
import { Telegram } from "./apps/telegram.js";

import { Users } from "./storages.js";

class UnknownApplicationError extends Error {
    constructor(appName) {
        const msg = `There's unknown application ${appName}`;
        super(msg);
        this.name = "UnknownApplicationError";
    }
}

class ApplicationsManager {
    constructor() {
        this.__apps = new Map();
        this.__apps.set("Telegram", new Telegram());

        this.__icons = new Map();
        this.__icons.set("Telegram", "icons8-telegram-app-48.png");
    }

    __getApplicationProperties(name, app) {
        return {
            name: name,
            icon: this.__icons.get(name),
            connected: app.isAlreadyConnected(),
            authURL: app.getAuthURL(),
            actions: app.getActions(),
            triggers: app.getTriggers()
        };
    }

    /**
     * @param {express.Express} expressApp Express application
     */
    initializeExpressRouter(expressApp) {
        console.log("Initialize applications routes");
        for (const app of this.__apps.values()) {
            expressApp.use(app.getRouter());
        }
    }

    get applications() {
        const modifiedApps = [];
        for (const [name, app] of this.__apps.entries()) {
            modifiedApps.push(this.__getApplicationProperties(name, app));
        }
        return modifiedApps;
    }

    getApplicationByName(appName) {
        if (!this.__apps.has(appName)) {
            throw new UnknownApplicationError(appName);
        }
        return this.__getApplicationProperties(appName, this.__apps.get(appName));
    }

    /**
     * @param {Object} ctx - Context with trigger properties
     * @param {string} app - The name of the application whose trigger you want to create
     * @param {string} name - Name of the application trigger
     * @param {Object} args - Trigger specific arguments
     * 
     * @returns {Trigger}
     */
    createTrigger(ctx) {
        if (!this.__apps.has(ctx.app)) {
            throw new UnknownApplicationError(ctx.app);
        }
        return this.__apps.get(ctx.app).createTrigger(ctx);
    }

    /**
     * @param {Object} ctx - Context with action properties
     * @param {string} app - The name of the application whose action you want to create
     * @param {string} name - Name of the application action
     * @param {Object} args - Action specific arguments
     * 
     * @returns {Action}
     */
    createAction(ctx) {
        if (!this.__apps.has(ctx.app)) {
            throw new UnknownApplicationError(ctx.app);
        }
        return this.__apps.get(ctx.app).createAction(ctx);
    }
}


class Applet {
    /**
     * @param {Command} trigger 
     * @param {Command} action
     * @param {AtAppletCompletionCallback} atCompletionCallback
     */
    constructor(trigger, action, atCompletionCallback) {
        this.__atCompletionCallback = atCompletionCallback;
        this.__isCancelled = false;
        this.__isActive = true;
        this.__statesPromises = [
            () => {
                const fn = trigger.getFn();
                return new Promise((resolve, reject) => {
                    fn(this.__createCallback(resolve, reject));
                });
            },
            () => {
                const fn = action.getFn();
                return new Promise((resolve, reject) => {
                    fn(this.__createCallback(resolve, reject));
                });
            }
        ];
    }

    __createCallback(resolve, reject) {
        return (res, err) => {
            if (err) {
                return reject(err);
            }
            resolve(res);
        };
    }

    set active(value) {
        this.__isActive = value;
        if (this.__isActive && this.__isCancelled) {
            this.launch();
        }
    }

    async launch() {
        this.__isCancelled = false;
        for (const getStatePromise of this.__statesPromises) {
            if (!this.__isActive) {
                this.__isCancelled = true;
                return Promise.resolve("Applet was cancelled");
            }
            try {
                await getStatePromise();
            } catch (err) {
                return Promise.reject(err);
            }
        }
        this.__atCompletionCallback();
        setTimeout(() => this.launch());
        return Promise.resolve("Success");
    }

    cancel() {
        this.active = false;
    }
}

class AppletsManager {
    constructor() {
        this.__applets = new Map();
    }

    launch() {
        setInterval(() => {
            const inactiveApplets = Array.from(this.__applets.keys());

            for (const user of Users.find({})) {
                for (const applet of user.applets) {
                    inactiveApplets.splice(inactiveApplets.indexOf(applet.uuid), 1);

                    if (!applet.isActive) {
                        this.__applets.get(applet.uuid)?.cancel();
                        this.__applets.delete(applet.uuid);
                        continue;
                    }
                    if (this.__applets.has(applet.uuid)) {
                        continue;
                    }
                    this.__applets.set(applet.uuid, new Applet(
                        applicationsManager.createTrigger(applet.trigger),
                        applicationsManager.createAction(applet.action),
                        () => {
                            applet.counter++;
                        }
                    ));
                    this.__applets.get(applet.uuid)?.launch();
                }
            }

            this.__applets.forEach((_, uuid) => {
                if (inactiveApplets.includes(uuid)) {
                    this.__applets.get(uuid)?.cancel();
                    this.__applets.delete(uuid);
                }
            });
        }, 1000);
    }
}


class UtilsManager {
    constructor() {
        this.__utils = new Map();
        this.__utils.set("Telegram Bot FastMQ Server", new FastMQServer("telegram-bot"));
        this.__utils.set("Telegram Bot", new TelegramBot());
    }

    async launch() {
        for (const [name, util] of this.__utils.entries()) {
            console.log("Launch util", name);
            await util.launch();
        }
    }
}


const applicationsManager = new ApplicationsManager();
const appletsManager = new AppletsManager();
const utilsManager = new UtilsManager();

await utilsManager.launch();
appletsManager.launch();

export {
    applicationsManager as ApplicationsManager,
    appletsManager as AppletsManager,
    UnknownApplicationError
};
