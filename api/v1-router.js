import express from "express";

import { appsManager } from "../core/apps-manager.js";


export default function () {
    console.log("Initialize REST API v1 router");

    const router = express.Router();

    router.get("/apps", (_, res) => {
        res.json(appsManager.apps);
    });

    router.get("/apps/:appName", (req, res) => {
        const app = appsManager.getAppByName(req.params.appName);
        if (app) {
            res.json(app);
        } else {
            res.status(404).send();
        }
    });

    router.get("/apps/search/:filter", (req, res) => {
        const pattern = new RegExp(`${req.params.filter}*`, "i");
        const apps = appsManager.apps.filter((app) => pattern.test(app.name));
        res.json(apps);
    });

    return router;
}
