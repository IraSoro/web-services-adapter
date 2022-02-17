import http from "http";
import express from "express";

import apiFactory from "./api/api-factory.js";
import { Core } from "./core/core.js";

const host = process.env.HOST ?? "localhost";
const port = process.env.PORT ?? 3000;

const app = express();

app.set("port", port);
app.use(express.static("./public"));
// инициализация API
app.use("/api/v1/", apiFactory("v1"));

Core.someFunc();

http.createServer(app).listen(port, host, () => {
    console.log("App server running at", host + ":" + port);
});
