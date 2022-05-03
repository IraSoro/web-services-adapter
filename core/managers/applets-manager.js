import { v4 as uuidV4 } from "uuid";

import { appsManager } from "./apps-manager.js";


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
            applets.push({
                uuid: uuid,
                name: applet.name
            });
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
        // TODO @imblowfish: Реализовать генерацию имени апплета
        const name = "Some generated applet name";
        const trigger = appsManager.getAppInstance(appletCtx.trigger.app)
            .createTrigger(appletCtx.trigger.name, appletCtx.trigger.args);
        const action = appsManager.getAppInstance(appletCtx.action.app)
            .createCommand(appletCtx.action.name, appletCtx.action.args);
        const applet = new Applet(name, trigger.getFn(), action.getFn());
        applet.launch();
        this.__applets.set(uuidV4(), applet);
    }

    /**
     * Returns applet properties based on uuid
     * 
     * @param {string} appletUUID 
     * @returns {AppletProperties} 
     */
    get(appletUUID) {
        if (!this.__applets.has(appletUUID)) {
            return {};
        }
        const applet = this.__applets.get(appletUUID);
        return {
            uuid: appletUUID,
            name: applet.name
        };
    }

    /**
     * Delete applet based on the uuid
     * 
     * @param {string} appletUUID 
     */
    delete(appletUUID) {
        if (!this.__applets.has(appletUUID)) {
            return;
        }
        this.__applets.get(appletUUID).cancel();
        this.__applets.delete(appletUUID);
    }
}

const appletsManager = new AppletsManager();

export { appletsManager };
