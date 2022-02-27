import http from "http";

import express from "express";
import { google } from "googleapis";

import { App, Command } from "./app.js";


class Google extends App {
    constructor(ctx, scopes) {
        super(ctx);

        this._ctx.oauth2 = new google.auth.OAuth2(
            this._ctx.clientID,
            this._ctx.clientSecret,
            this._ctx.redirectURI
        );
        /*
         * NOTE @imblowfish:
         * Здесь происходит получение refresh_token, обозначающего,
         * что access_token устарел и есть возможность получить новый
         * без необходимости задействовать пользователя
         * Пока хз, как это влияет на работу, поэтому оставил закомментированным
         */
        // this.oauth2.on("tokens", (tokens) => {
        //     if (tokens.refresh_token) {
        //         console.log(tokens.refresh_token);
        //     }
        //     console.log(tokens.access_token);
        // });

        this._ctx.authURL = this._ctx.oauth2.generateAuthUrl({
            // 'online' (default) or 'offline' (gets refresh_token)
            access_type: "offline",
            scope: scopes
        });
    }

    getAuthType() {
        return "OAuth2";
    }

    getAuthURL() {
        return this._ctx.authURL;
    }

    async auth(callback) {
        return new Promise((resolve, reject) => {
            callback(this._ctx.authURL);

            let server = null;

            const redirectApp = express();
            redirectApp.use(express.json());
            redirectApp.get("/google/oauth2callback", async (req, res) => {
                try {
                    server.close();
                    const { tokens } = await this._ctx.oauth2.getToken(req.query.code);
                    this._ctx.oauth2.credentials = tokens;
                    res.json({ status: "OAuth2 Success!" });
                    resolve();
                } catch (err) {
                    res.json({ status: err });
                    reject(err);
                }
            });

            server = http.createServer(redirectApp).listen(3000, "localhost", () => {
                console.log("Google RedirectApp running at localhost:3000");
            });
        });
    }
}


class OnEvent extends Command {
    constructor(ctx, args) {
        super(ctx, args);
    }

    async exec() {
        const calendar = google.calendar({
            version: "v3",
            auth: this._ctx.oauth2
        });
        try {
            const events = await calendar.events.list({
                calendarId: this._args.calendarID,
                timeMin: new Date().toISOString(),
                timeZone: "UTC"
            });
            console.log("Google Calendar Events:");
            for (const item of events.data.items) {
                console.log(item.etag, item.summary);
                if (this._args.etag == item.etag.replaceAll("\"", "")) {
                    const eventStartDateTime = new Date(item.start.dateTime);
                    const currentDateTime = new Date();
                    const diff = eventStartDateTime - currentDateTime;
                    if (diff < 0) {
                        return Promise.resolve();
                    }
                    return new Promise((resolve) => {
                        setTimeout(resolve, eventStartDateTime - currentDateTime);
                    });
                }
            }
            return Promise.reject("Cannot found etag event", this._args.etag);
        } catch (err) {
            return Promise.reject(err);
        }
    }
}

export class GoogleCalendar extends Google {
    constructor(ctx) {
        super(ctx, "https://www.googleapis.com/auth/calendar");
    }

    createTrigger(name, args) {
        switch (name) {
            case "OnEvent":
                return new OnEvent(this._ctx, args);
            default:
                throw new Error("Unknown trigger");
        }
    }


    async check() {
        const calendar = google.calendar({
            version: "v3",
            auth: this._ctx.oauth2
        });

        try {
            const list = await calendar.events.list({
                calendarId: this._ctx.calendarID
            });
            if (list.status == 200) {
                return Promise.resolve();
            }
            return Promise.reject(list);
        } catch (err) {
            return Promise.reject(err);
        }
    }
}
