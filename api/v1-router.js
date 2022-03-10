import express from "express";

import { appsManager } from "../core/apps-manager.js";


export default function () {
    console.log("Initialize REST API v1 router");

    const router = express.Router();

    router.get("/", (_, res) => {
        res.json({ res: "Success" });
    });

    router.get("/apps", (_, res) => {
        res.json(appsManager.getSupportedApps());
    });

    router.get("/apps/:appName", (req, res) => {
        const pattern = new RegExp(`${req.params.appName}*`, "i");
        const apps = [];
        for (const app of appsManager.getSupportedApps()) {
            if (pattern.test(app)) {
                apps.push(app);
            }
        }
        res.json(apps);
    });

    router.get("/apps/:appName/icon", (req, res) => {
        const appName = req.params.appName;
        const iconPath = appsManager.getAppIcon(appName);
        try {
            res.sendFile(iconPath, { root: "./" });
        } catch (err) {
            res.json({
                res: "Failed",
                description: "Cannot send app icon " + appName,
                reason: JSON.stringify(err)
            });
        }
    });

    router.get("/connect/:appName", (req, res) => {
        try {
            const app = appsManager.getAppInstance(req.params.appName);
            if (app.isAlreadyConnected()) {
                res.send({
                    res: "Success",
                    msg: "Already connected"
                });
            } else {
                res.send({
                    res: "Success",
                    authURL: app.getAuthURL()
                });
            }
        } catch (err) {
            res.send({
                res: "Failed",
                description: "Cannot connect to app" + req.params.appName,
                reason: JSON.stringify(err)
            });
        }
    });

    return router;
}
