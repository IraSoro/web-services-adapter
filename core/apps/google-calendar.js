import http from "http";

import open from "open";
import express from "express";
import { google } from "googleapis";

import { App, Command } from "./app.js";


/*
 * Последовательность получения API Token
 * Перейти на https://console.developers.google.com/
 * Создать проект
 * Перейти в меню слева в APIs & Services -> Credentials
 * Нажать на кнопку Create credentials
 * https://cloud.google.com/docs/authentication/api-keys
 * https://github.com/googleapis/google-api-nodejs-client
 */

/* 
 * Чтобы узнать свой calendarID
 * Перейти в Google Calendar, слева будет список календарей, нажать на вертикальные 3 точки
 * перейти в настройки, в пункт интеграции, там будет идентификатор календаря
 * также нужно включить календарь в cloud developer по ссылке, которую покажет googleapis в ошибке
 */


class TestCommand extends Command {
    constructor(ctx, args) {
        super(ctx, args);
    }

    async exec() {
    }
}

export class GoogleCalendar extends App {
    constructor(ctx) {
        super(ctx);
    }

    async auth() {
        return new Promise((resolve, reject) => {
            this.oauth2 = new google.auth.OAuth2(
                this._ctx.clientID,
                this._ctx.clientSecret,
                this._ctx.redirectURI
            );
            this.oauth2.on("tokens", (tokens) => {
                console.log("oauth2 on tokens");
                if (tokens.refresh_token) {
                    console.log(tokens.refresh_token);
                }
                console.log(tokens.access_token);
            });

            const authURL = this.oauth2.generateAuthUrl({
                // 'online' (default) or 'offline' (gets refresh_token)
                access_type: "offline",
                scope: "https://www.googleapis.com/auth/calendar"
            });
            open(authURL);
            console.log("Got authURL", authURL);

            const redirectApp = express();
            redirectApp.use(express.json());
            redirectApp.get("/google/oauth2callback", async (req, res) => {
                console.log("/google/oauth2callback");
                try {
                    const { tokens } = await this.oauth2.getToken(req.query.code);
                    console.log("tokens", tokens);
                    this.oauth2.credentials = tokens;
                    res.json({ status: "OAuth2 Success!" });
                    resolve();
                } catch (err) {
                    res.json({ status: err });
                    reject(err);
                }
            });

            http.createServer(redirectApp).listen(3000, "localhost", () => {
                console.log("Google RedirectApp running at localhost:3000");
            });
        });
    }

    createCommand(name, args) {
        switch (name) {
            case "TestCommand":
                return new TestCommand(this._ctx, args);
            default:
                throw new Error("Unknown command");
        }
    }


    async check() {
        const calendar = google.calendar({
            version: "v3",
            auth: this.oauth2
        });
        const list = await calendar.events.list({
            calendarId: this._ctx.calendarID
        });
        console.log(list);
    }
}
