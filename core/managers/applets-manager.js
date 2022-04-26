import { v4 as uuidV4 } from "uuid";

import { appsManager } from "./apps-manager.js";


export class Applet {
    constructor(trigger, action) {
        this.__isCancelled = false;
        this.__executionsCount = 0;

        this.___statesPromises = [
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

    async launch() {
        this.__isCancelled = false;
        for (const getStatePromise of this.___statesPromises) {
            if (this.__isCancelled) {
                return Promise.resolve("Applet was cancelled");
            }
            try {
                await getStatePromise();
            } catch (err) {
                return Promise.reject(err);
            }
        }
        this.__executionsCount++;
        setTimeout(() => this.launch());
        return Promise.resolve("Success");
    }

    cancel() {
        this.__isCancelled = true;
    }
}

export class AppletsManager {
    constructor() {
        this.__applets = new Map();
    }

    get applets() {
        const res = {};
        for (const [uuid, applet] of this.__applets) {
            res[uuid] = {
                name: applet.name,
                active: applet.active,
                count: applet.instance.__executionsCount
            };
        }
        return res;
    }

    add(appletCtx) {
        // TODO @imblowfish: Реализовать генерацию имени апплета
        const appletName = "Some generated applet name";
        const trigger = appsManager.getAppInstance(appletCtx.trigger.app)
            .createTrigger(appletCtx.trigger.name, appletCtx.trigger.args);
        const action = appsManager.getAppInstance(appletCtx.action.app)
            .createCommand(appletCtx.action.name, appletCtx.action.args);
        const applet = new Applet(trigger.getFn(), action.getFn());
        applet.launch();
        this.__applets.set(uuidV4(), {
            name: appletName,
            active: true,
            instance: applet
        });
    }

    get(appletUUID) {
        return this.__applets.get(appletUUID);
    }

    delete(appletUUID) {
        this.get(appletUUID).instance.cancel();
        this.__applets.delete(appletUUID);
    }
}

const appletsManager = new AppletsManager();

export { appletsManager };
