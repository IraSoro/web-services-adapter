import express from "express";

import {
    ApplicationsManager,
    AppletsManager
} from "../core/managers.js";


/* TODO @imblowfish: В качестве ответа сейчас приходит абсолютно ничего не говорящее
 * {
 *    "res": "Success"
 * }
 * Нужно это поправить и возвращать "говорящий" результат
 */

const createAppsRouter = () => {
    const router = express.Router();

    router.get(["/", "/search"], (_, res) => {
        res.json(ApplicationsManager.applications);
    });

    router.get("/:filter/search", (req, res) => {
        const pattern = new RegExp(`${req.params.filter}*`, "i");
        res.json(
            ApplicationsManager.applications.filter((app) => pattern.test(app.name))
        );
    });

    router.get("/:appName", (req, res) => {
        try {
            res.json(ApplicationsManager.getApplicationByName(req.params.appName));
        } catch {
            res.status(404).send();
        }
    });

    router.get("/:appName/icon", (req, res) => {
        try {
            const app = ApplicationsManager.getApplicationByName(req.params.appName);
            res.redirect(`/icons/${app.icon}`);
        } catch {
            res.status(404).send();
        }
    });

    return router;
};

const createAppletsRouter = () => {
    const router = express.Router();

    router.get("/", (_, res) => {
        res.json(AppletsManager.applets);
    });

    router.post("/", (req, res) => {
        AppletsManager.add(req.body);
        res.json({
            res: "Success"
        });
    });

    router.get("/:appletID", (req, res) => {
        const appletID = req.params.appletID;
        const applet = AppletsManager.get(appletID);
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
        AppletsManager.delete(req.params.appletID);
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
