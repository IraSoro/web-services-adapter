import express from "express";

import { appsManager } from "../core/managers/apps-manager.js";
import { appletsManager } from "../core/managers/applets-manager.js";


/* TODO @imblowfish: В качестве ответа сейчас приходит абсолютно ничего не говорящее
 * {
 *    "res": "Success"
 * }
 * Нужно это поправить и возвращать "говорящий" результат
 */

const createAppsRouter = () => {
    const router = express.Router();

    router.get("/", (_, res) => {
        res.json(appsManager.apps);
    });

    router.get("/search", (_, res) => {
        return res.json(appsManager.apps);
    });

    router.get("/:filter/search", (req, res) => {
        const pattern = new RegExp(`${req.params.filter}*`, "i");
        const apps = appsManager.apps.filter((app) => pattern.test(app.name));
        res.json(apps);
    });

    router.get("/:appName", (req, res) => {
        const app = appsManager.getAppByName(req.params.appName);
        if (app) {
            res.json(app);
        } else {
            res.status(404).send();
        }
    });

    router.get("/:appName/icon", (req, res) => {
        const app = appsManager.getAppByName(req.params.appName);
        if (!app) {
            res.status(404).send();
            return;
        }
        res.redirect(`/icons/${app.icon}`);
    });

    return router;
};

const createAppletsRouter = () => {
    const router = express.Router();

    router.get("/", (_, res) => {
        res.json(appletsManager.applets);
    });

    router.post("/", (req, res) => {
        appletsManager.add(req.body);
        res.json({
            res: "Success"
        });
    });

    router.get("/:appletID", (req, res) => {
        const appletID = req.params.appletID;
        const applet = appletsManager.get(appletID);
        if (!applet) {
            res.status(404).send();
            return;
        }
        res.json(applet);
    });

    router.post("/:appletID", (req, res) => {
        // TODO @imblowfish: Implement me...
        // const appletID = req.params.appletID;
        // const params = req.body;
        // appletsManager.update(appletID, params);
        res.json({
            res: "Success"
        });
    });

    router.delete("/:appletID", (req, res) => {
        appletsManager.delete(req.params.appletID);
        res.json({
            res: "Success"
        });
    });

    return router;
};

export default function () {
    console.log("Initialize REST API v1 router");

    const router = express.Router();

    router.use("/apps", createAppsRouter());
    router.use("/applets", createAppletsRouter());

    return router;
}
