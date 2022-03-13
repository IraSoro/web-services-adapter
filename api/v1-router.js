import express from "express";

import { appsManager } from "../core/managers/apps-manager.js";


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

export default function () {
    console.log("Initialize REST API v1 router");

    const router = express.Router();

    router.use("/apps", createAppsRouter());

    return router;
}
