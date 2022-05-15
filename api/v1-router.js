import express from "express";

import {
    ApplicationsManager,
    AppletsManager,
    UnknownApplicationError,
    UnknownAppletUUIDError
} from "../core/managers.js";


const createAppsRouter = () => {
    const router = express.Router();

    /* TODO @imblowfish: Мне не нравится, что тут дублируется поведение для /apps и apps/search
     * нужно на стороне frontend проверять, если фильтр пустой, то обращаться к /apps, если не пустой, то к поиску приложения
     */
    router.get(["/", "/search"], (_, res) => {
        try {
            res.json(ApplicationsManager.applications);
        } catch (err) {
            res.status(500).send(err.message);
        }
    });

    /* TODO @imblowfish: Данный маршрут в принципе дублирует appName за исключением того, что appName не производит поиска по регулярке
     * думаю, стоит убрать этот маршрут и оставить только appName с поиском, тогда можно будет избавиться от getAppByName в ApplicationsManager
     * либо перенести поиск по регулярке в него
     */
    router.get("/:filter/search", (req, res) => {
        try {
            const pattern = new RegExp(`${req.params.filter}*`, "i");
            res.json(
                ApplicationsManager.applications.filter((app) => pattern.test(app.name))
            );
        } catch (err) {
            res.status(500).send(err.message);
        }
    });

    router.get("/:appName", (req, res) => {
        try {
            res.json(ApplicationsManager.getApplicationByName(req.params.appName));
        } catch (err) {
            if (err instanceof UnknownApplicationError) {
                res.status(404).send(err.message);
            } else {
                res.status(500).send(err.message);
            }
        }
    });

    router.get("/:appName/icon", (req, res) => {
        try {
            const app = ApplicationsManager.getApplicationByName(req.params.appName);
            res.redirect(`/icons/${app.icon}`);
        } catch (err) {
            if (err instanceof UnknownApplicationError) {
                res.status(404).send();
            } else {
                res.status(500).send(err.message);
            }
        }
    });

    return router;
};

const createAppletsRouter = () => {
    const router = express.Router();

    router.get("/", (_, res) => {
        try {
            res.json(AppletsManager.applets);
        } catch (err) {
            res.status(500).send(err.message);
        }
    });

    router.post("/", (req, res) => {
        try {
            AppletsManager.add(req.body);
            res.status(200).send();
        } catch (err) {
            res.status(500).send(err.message);
        }
    });

    router.get("/:appletUUID", (req, res) => {
        try {
            const appletUUID = req.params.appletUUID;
            res.json(AppletsManager.get(appletUUID));
        } catch (err) {
            if (err instanceof UnknownAppletUUIDError) {
                res.status(404).send(err.message);
            } else {
                res.status(500).send(err.message);
            }
        }
    });

    router.post("/:appletUUID", (req, res) => {
        // TODO @imblowfish: Implement me...
        // const appletID = req.params.appletID;
        // const params = req.body;
        // appletsManager.update(appletID, params);
        res.json({
            res: "Success"
        });
    });

    router.delete("/:appletUUID", (req, res) => {
        try {
            AppletsManager.delete(req.params.appletUUID);
            res.status(200).send();
        } catch (err) {
            if (err instanceof UnknownAppletUUIDError) {
                res.status(404).send(err.message);
            } else {
                res.status(500).send(err.message);
            }
        }
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
