import fs from "fs";

import express from "express";

import { appManager, iconManager } from "../core/apps.js";


export default function () {
    const router = express.Router();

    router.get("/", (_, res) => {
        res.json({ res: "Success" });
    });

    router.get("/apps", (_, res) => {
        res.json(appManager.getSupportedApps());
    });

    router.get("/apps/:appName", async (req, res) => {
        const pattern = new RegExp(`${req.params.appName}*`, "i");
        const apps = [];
        for (const app of appManager.getSupportedApps()) {
            if (pattern.test(app)) {
                apps.push(app);
            }
        }
        res.json(apps);
    });

    router.get("/apps/:appName/icon", async (req, res) => {
        const appName = req.params.appName;
        const iconPath = "./core/apps/icons/" + iconManager.getIconPathByAppName(appName);
        try {
            await fs.promises.access(iconPath, fs.constants.R_OK);
            res.sendFile(iconPath, { root: "./" });
        } catch (err) {
            res.json({
                res: "Error",
                description: "Cannot send app icon " + appName,
                reason: JSON.stringify(err)
            });
        }
    });

    return router;
}
