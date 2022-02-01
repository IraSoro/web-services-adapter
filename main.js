import http from "http";
import express from "express";

const host = process.env.HOST ?? "localhost";
const port = process.env.PORT ?? 3000;

const app = express();

app.set("port", port);
app.use(express.static("./public"));

http.createServer(app).listen(port, host, () => {
    console.log("App server running at", host + ":" + port);
});
