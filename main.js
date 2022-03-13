import http from "http";
import express from "express";

import apiFactory from "./api/api-factory.js";
import redirectRouter from "./api/redirect-router.js";
import { appsManager } from "./core/managers/apps-manager.js";
import { utilsManager } from "./utils/utils-manager.js";


const host = process.env.HOST ?? "localhost";
const port = process.env.PORT ?? 3000;

const app = express();

app.set("port", port);
app.use(express.json());
app.use(express.static("./public"));
app.use("/icons", express.static("./assets/icons"));
// инициализация API
appsManager.initRoutes(app);
app.use("/api/v1/", apiFactory("v1"));
app.use(redirectRouter());
// запуск утилит
utilsManager.launchAll();

http.createServer(app).listen(port, host, () => {
    console.log("App server running at", host + ":" + port);
});
