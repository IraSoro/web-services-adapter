import express from "express";
import { v4 as uuidV4 } from "uuid";

import {
    hashPassword,
    comparePasswordAndHash,
    signAccessToken,
    signRefreshToken,
    verifyToken
} from "./auth.js";
import {
    ApplicationsManager,
    UnknownApplicationError
} from "../core/managers.js";
import { Users } from "../core/storages.js";


async function accessTokenCheckerMiddleware(req, res, next) {
    try {
        if (!req.session.uuid) {
            return res.status(401).json({
                message: "You're not logged in"
            });
        }
        const accessToken = req.headers.authorization.replace("Bearer ", "");
        if (!accessToken) {
            return res.status(401).json({
                message: "accessToken is empty"
            });
        }
        const user = Users.by("uuid", req.session.uuid);
        if (!user) {
            return res.status(401).json({
                message: "Unknown user"
            });
        }
        if (user.accessToken != accessToken) {
            throw new Error("Access token is not the same as in Users collection");
        }
        const payload = await verifyToken(accessToken);
        if (payload.aud != req.session.uuid) {
            return res.status(401).json({
                message: "Incorrect uuid"
            });
        }
        // TODO @imblowfish: проверять, не заблокирован ли пользователь, если да, то 403
        next();
    } catch (err) {
        res.status(403).json({
            message: "accessToken expired"
        });
    }
}

const createAuthRouter = () => {
    const router = express.Router();

    router.post("/signUp", async (req, res) => {
        const base64Credentials = req.headers.authorization.replace("Basic", "");
        const decoded = Buffer.from(base64Credentials, "base64").toString();
        const [username, password] = decoded.split(":");

        if (Users.by("username", username)) {
            return res.status(409).json({
                message: "Already has this username"
            });
        }

        Users.insert({
            username: username,
            uuid: uuidV4(),
            hashedPassword: await hashPassword(password),
            applets: [],
            accounts: {}
        });

        res.status(200).send();
    });

    router.post("/signIn", async (req, res) => {
        const base64Credentials = req.headers.authorization.replace("Basic ", "");
        const decoded = Buffer.from(base64Credentials, "base64").toString();
        const [username, password] = decoded.split(":");

        let user = Users.by("username", username);
        if (!user || !await comparePasswordAndHash(password, user.hashedPassword)) {
            return res.status(400).json({
                message: "Unknown username or password"
            });
        }

        user.refreshToken = await signRefreshToken(user.uuid);
        Users.update(user);

        req.session.uuid = user.uuid;
        req.session.refreshToken = user.refreshToken;

        res.redirect(307, "/api/v1/auth/accessToken");
    });

    router.post("/accessToken", async (req, res) => {
        //  FIXME @imblowfish: Сейчас можно делать запросы токена до бесконечности, исправить 
        try {
            const refreshToken = req.session.refreshToken;
            if (!refreshToken) {
                throw new Error("refreshToken is empty");
            }
            let user = Users.by("uuid", req.session.uuid);
            if (user.refreshToken != refreshToken) {
                throw new Error("Incorrect refreshToken");
            }
            const payload = await verifyToken(refreshToken);
            if (payload.aud != req.session.uuid) {
                throw new Error("Incorrect uuid");
            }
            user.accessToken = await signAccessToken(user.uuid);
            Users.update(user);

            res.status(200).json({
                tokenType: "Bearer",
                accessToken: user.accessToken
            });
        } catch (err) {
            return res.status(401).json({
                message: err.message
            });
        }
    });

    router.post("/logOut", accessTokenCheckerMiddleware, (req, res) => {
        if (!req.session.uuid) {
            return res.status(400).json({
                message: "You're not logged in"
            });
        }
        let user = Users.by("uuid", req.session.uuid);
        if (!user) {
            return res.status(400).json({
                message: "Cannot found user by this uuid"
            });
        }

        delete req.session.refreshToken;
        delete req.session.uuid;

        delete user.refreshToken;
        delete user.accessToken;
        Users.update(user);

        res.status(200).send();
    });

    return router;
};

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

    router.get("/", (req, res) => {
        try {
            res.json(Users.by("uuid", req.session.uuid).applets);
        } catch (err) {
            res.status(500).send(err.message);
        }
    });

    router.post("/", (req, res) => {
        try {
            const user = Users.by("uuid", req.session.uuid);
            const uuid = uuidV4();
            user.applets.push({
                uuid: uuid,
                name: `Applet #${uuid}`,
                isActive: true,
                counter: 0,
                ...req.body
            });
            Users.update(user);

            res.status(202).send();
        } catch (err) {
            res.status(500).send(err.message);
        }
    });

    router.get("/:appletUUID", (req, res) => {
        const user = Users.by("uuid", req.session.uuid);
        const applet = user.applets.find((applet) => applet.uuid == req.params.appletUUID);
        if (!applet) {
            res.status(404).json({
                message: "Cannot found applet by this uuid"
            });
        }
        res.status(200).json(applet);
    });

    router.post("/:appletUUID", (req, res) => {
        /* FIXME @imblowfish: Сейчас есть возможность через запрос
         * менять любой параметр апплета, так как просто происходит
         * destruct объекта req.body, что потенциально опасно, нужно
         * добавить какой-нибудь массив requiredChanges или possibleChanges
         * и сверяться с ним
         */
        const user = Users.by("uuid", req.session.uuid);
        const applets = user.applets.map((applet) => {
            if (applet.uuid != req.params.appletUUID) {
                return applet;
            }
            return {
                ...applet,
                ...req.body
            };
        });
        user.applets = applets;
        Users.update(user);
        res.status(202).send();
    });

    router.delete("/:appletUUID", (req, res) => {
        const user = Users.by("uuid", req.session.uuid);
        user.applets = user.applets.filter((applet) => applet.uuid != req.params.appletUUID);
        Users.update(user);
        res.status(202).send();
    });

    return router;
};

export default function () {
    console.log("Initialize REST API v1 router");

    const router = express.Router();

    router.use("/auth", createAuthRouter());
    router.use("/apps", accessTokenCheckerMiddleware, createAppsRouter());
    router.use("/applets", accessTokenCheckerMiddleware, createAppletsRouter());

    return router;
}
