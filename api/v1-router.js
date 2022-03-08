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

    router.get("/apps/:appName", (req, res) => {
        res.send("Search app" + req.params.appName);
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
