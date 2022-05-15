import http from "http";
import express from "express";

import apiV1Router from "./api/v1-router.js";
import redirectRouter from "./api/redirect-router.js";
import {
    ApplicationsManager,
    AppletsManager,
    UtilsManager
} from "./core/managers.js";


const host = process.env.HOST ?? "localhost";
const port = process.env.PORT ?? 3000;

const app = express();

app.set("port", port);
app.use(express.json());
app.use(express.static("./public"));
app.use("/icons", express.static("./assets/icons"));
// инициализация API
ApplicationsManager.initializeExpressRouter(app);
app.use("/api/v1/", apiV1Router());
app.use(redirectRouter());
// запуск утилит и загрузка сохраненных апплетов
UtilsManager.launchAll()
    .then(() => AppletsManager.load());

http.createServer(app).listen(port, host, () => {
    console.log("App server running at", host + ":" + port);
});
