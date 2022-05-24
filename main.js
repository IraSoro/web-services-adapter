import http from "http";
import express from "express";
import session from "express-session";
import connectLoki from "connect-loki";

import apiV1Router from "./api/v1-router.js";
import redirectRouter from "./api/redirect-router.js";
import { getConfig } from "./core/cfg.js";
import { ApplicationsManager } from "./core/managers.js";


const host = process.env.HOST ?? getConfig("Settings").host ?? "localhost";
const port = process.env.PORT ?? getConfig("Settings").port ?? 3000;

const app = express();

app.set("port", port);
app.use(express.json());
// NOTE @imblowfish: https://www.npmjs.com/package/express-session
const LokiStore = connectLoki(session);
app.use(session({
    cookie: {
        path: "/",
        // TODO @imblowfish: Убрать комментарий, когда будет сделан prod-режим
        // secure: process.env.NODE_ENV == "production" : true : false,
        httpOnly: true,
        maxAge: 24 * 60 * 60 * 1000 // 1 day
    },
    secret: getConfig("Auth").secret,
    resave: false,
    saveUninitialized: false,
    store: new LokiStore({
        path: "./.config/sessions.json",
        autosave: true,
        logErrors: true
    })
}));
app.use(express.static("./public"));
app.use("/icons", express.static("./assets/icons"));
// инициализация API
ApplicationsManager.initializeExpressRouter(app);
app.use("/api/v1/", apiV1Router());
app.use(redirectRouter());

http.createServer(app).listen(port, host, () => {
    console.log("App server running at", host + ":" + port);
});
