import { v4 as uuidV4 } from "uuid";

import { TelegramBot } from "./utils/telegram-bot.js";
import { FastMQServer } from "./utils/fastmq.js";
import { AppletsStorage } from "./cfg.js";
import { Telegram } from "./apps/telegram.js";


/*
 * ApplicationsManager
 */
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
     * 
     * @param {string} uuid - Universally unique identifier
     * 
     * @param {Object} ctx - Context with trigger properties
     * @param {string} app - The name of the application whose trigger you want to create
     * @param {string} name - Name of the application trigger
     * @param {Object} args - Trigger specific arguments
     * 
     * @returns {Trigger}
     */
    createTrigger(uuid, ctx) {
        if (!this.__apps.has(ctx.app)) {
            throw new UnknownApplicationError(ctx.app);
        }
        return this.__apps.get(ctx.app).createTrigger(uuid, ctx);
    }

    /**
     * 
     * @param {string} uuid - Universally unique identifier
     * 
     * @param {Object} ctx - Context with action properties
     * @param {string} app - The name of the application whose action you want to create
     * @param {string} name - Name of the application action
     * @param {Object} args - Action specific arguments
     * 
     * @returns {Action}
     */
    createAction(uuid, ctx) {
        if (!this.__apps.has(ctx.app)) {
            throw new UnknownApplicationError(ctx.app);
        }
        return this.__apps.get(ctx.app).createAction(uuid, ctx);
    }
}

/*
 * AppletsManager
 */
class UnknownAppletUUIDError extends Error {
    constructor(appletUUID) {
        const msg = `There's unknown applet with uuid ${appletUUID}`;
        super(msg);
        this.name = "UnknownAppletUUIDError";
    }
}

class Applet {
    /**
     * @param {string} name 
     * @param {Command} trigger 
     * @param {Command} action 
     */
    constructor(name, trigger, action) {
        // TODO @imblowfish: Реализовать счетчик выполнения апплета
        // TODO @imblowfish: Реализовать включение/отключение апплета
        this.__name = name;
        this.__isCancelled = false;
        this.__runningCounter = 0;
        this.__statesPromises = [
            () => {
                return new Promise((resolve, reject) => {
                    trigger(this.__createCallback(resolve, reject));
                });
            },
            () => {
                return new Promise((resolve, reject) => {
                    action(this.__createCallback(resolve, reject));
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

    get name() {
        return this.__name;
    }

    get runningCounter() {
        return this.__runningCounter;
    }

    async launch() {
        this.__isCancelled = false;
        for (const getStatePromise of this.__statesPromises) {
            if (this.__isCancelled) {
                return Promise.resolve("Applet was cancelled");
            }
            try {
                await getStatePromise();
            } catch (err) {
                return Promise.reject(err);
            }
        }
        this.__runningCounter++;
        setTimeout(() => this.launch());
        return Promise.resolve("Success");
    }

    cancel() {
        this.__isCancelled = true;
    }
}

class AppletsManager {
    constructor() {
        this.__applets = new Map();
    }

    __getAppletProperties(uuid, applet) {
        return {
            uuid: uuid,
            name: applet.name
        };
    }

    load() {
        for (const [uuid, appletCtx] of AppletsStorage) {
            this.add({
                uuid: uuid,
                ...appletCtx
            });
            console.log(`Applet ${uuid} loaded`);
        }
    }

    /**
     * @typedef AppletProperties
     * @property {string} uuid
     * @property {string} name
     */

    /**
     * @returns {Array.<AppletProperties>}
     */
    get applets() {
        const applets = [];
        for (const [uuid, applet] of this.__applets) {
            applets.push(
                this.__getAppletProperties(uuid, applet)
            );
        }
        return applets;
    }

    /**
     * Creates new trigger, launch it and add in the applets list
     * 
     * @param {Object} appletCtx - Context with applet properties
     * @param {Object} appletCtx.trigger - Trigger properties
     * @param {string} appletCtx.trigger.app - Application which using as trigger
     * @param {string} appletCtx.trigger.name - Name of the application trigger
     * @param {Object} appletCtx.trigger.args - Trigger specific arguments
     * 
     * @param {Object} appletCtx.action - Action properties
     * @param {string} appletCtx.action.app - Application which using as action
     * @param {string} appletCtx.action.name - Name of the application action
     * @param {Object} appletCtx.action.args - Action specific arguments
     */
    add(appletCtx) {
        const uuid = appletCtx.uuid ?? uuidV4();
        const applet = new Applet(
            "Applet #" + uuid,
            applicationsManager.createTrigger(uuid, appletCtx.trigger).getFn(),
            applicationsManager.createAction(uuid, appletCtx.action).getFn()
        );
        if (!appletCtx.uuid) {
            AppletsStorage.set(uuid, appletCtx);
        }
        applet.launch();
        this.__applets.set(uuid, applet);
    }

    /**
     * Returns applet properties based on uuid
     * 
     * @param {string} appletUUID 
     * @returns {AppletProperties} 
     */
    get(appletUUID) {
        if (!this.__applets.has(appletUUID)) {
            throw new UnknownAppletUUIDError(appletUUID);
        }
        return this.__getAppletProperties(appletUUID, this.__applets.get(appletUUID));
    }

    /**
     * Delete applet based on the uuid
     * 
     * @param {string} appletUUID 
     */
    delete(appletUUID) {
        if (!this.__applets.has(appletUUID)) {
            throw new UnknownAppletUUIDError(appletUUID);
        }
        this.__applets.get(appletUUID).cancel();
        this.__applets.delete(appletUUID);
        AppletsStorage.delete(appletUUID);
    }
}

/*
 * UtilsManager
 */
class UtilsManager {
    constructor() {
        this.__utils = new Map();
        this.__utils.set("Telegram Bot FastMQ Server", new FastMQServer("telegram-bot"));
        this.__utils.set("Telegram Bot", new TelegramBot());
    }

    async launchAll() {
        for (const [name, util] of this.__utils.entries()) {
            console.log("Launch util", name);
            await util.launch();
        }
    }
}


const applicationsManager = new ApplicationsManager();
const appletsManager = new AppletsManager();
const utilsManager = new UtilsManager();

export {
    applicationsManager as ApplicationsManager,
    appletsManager as AppletsManager,
    utilsManager as UtilsManager,
    UnknownApplicationError,
    UnknownAppletUUIDError
};
