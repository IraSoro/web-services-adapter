import { appsManager } from "./apps-manager.js";

class AppletExecutor {
    constructor(appletCtx) {
        const triggerApp = appsManager.getAppInstance(appletCtx.triggerAppName);
        const actionApp = appsManager.getAppInstance(appletCtx.actionAppName);

        this.__trigger = triggerApp.createTrigger(appletCtx.triggerName,
            appletCtx.triggerArgs);
        this.__action = actionApp.createCommand(appletCtx.actionName,
            appletCtx.actionArgs);

        this.__error = "";
        this.__count = 0;

        this.__rejector = null;
    }

    get count() {
        return this.__count;
    }

    get error() {
        return this.__error;
    }

    cancel() {
        if (this.__rejector) {
            this.__rejector("Applet canceled");
            this.__rejector = null;
        }
    }

    async launch() {
        new Promise((resolve, reject) => {
            this.__rejector = reject;

            const exec = async () => {
                try {
                    await this.__trigger.exec();
                    await this.__action.exec();
                    resolve();
                } catch (err) {
                    reject(err);
                }
            };

            exec();
        })
            .then(() => {
                this.__count++;
                setTimeout(() => this.launch());
            })
            .catch((err) => {
                if (err != "Applet canceled") {
                    this.__error = JSON.stringify(err);
                }
            });
    }
}

class AppletsManager {
    constructor() {
        this.__applets = new Map();
    }

    __generateAppletID() {
        return this.__applets.size
            ? (Math.max(...this.__applets.keys()) + 1).toString()
            : "0";
    }

    __generateAppletName(appletCtx) {
        return `On ${appletCtx.triggerName} ${JSON.stringify(appletCtx.triggerArgs)} in ${appletCtx.triggerAppName} `
            + `${appletCtx.actionName} ${JSON.stringify(appletCtx.actionArgs)} in ${appletCtx.actionAppName}`;
    }

    get applets() {
        const res = {};
        for (const [id, applet] of this.__applets) {
            res[id] = {
                name: applet.name,
                active: applet.active,
                count: applet.executor.count
            };
            if (applet.executor.error) {
                res[id].error = applet.executor.error;
            }
        }
        return res;
    }

    add(appletCtx) {
        const newAppletID = this.__generateAppletID();
        this.__applets.set(newAppletID, {
            ctx: appletCtx,
            executor: new AppletExecutor(appletCtx),
            name: this.__generateAppletName(appletCtx),
            active: true
        });
        this.__applets.get(newAppletID).executor.launch();
    }

    get(appletID) {
        return this.applets[appletID];
    }

    delete(appletID) {
        this.__applets.delete(appletID);
    }

    update(appletID, params) {
        if (!this.__applets.has(appletID)) {
            return;
        }
        const applet = this.__applets.get(appletID);

        if (typeof params.active !== "undefined") {
            if (applet.active && !params.active) {
                applet.executor.cancel();
                applet.active = false;
            }
            if (!applet.active && params.active) {
                applet.executor.launch();
                applet.active = true;
            }
        }
    }
}

const appletsManager = new AppletsManager();

export { appletsManager };
