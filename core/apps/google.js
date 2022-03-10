import express from "express";
import { google } from "googleapis";

import { App, Command } from "./app.js";


/**
 * Google services base class
 */
class Google extends App {
    /**
     * @param {string} name Google specific application name
     * @param {string|Array.<string>} scopes Application permissions
     */
    constructor(name, scopes) {
        super(name);

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

    isAlreadyConnected() {
        /*
         * NOTE @imblowfish: Если credentials - пустой объект, значит не было
         * обращения oauth2callback и нет токена, пользователь не авторизован
         */
        return Boolean(Object.entries(this._ctx.oauth2.credentials).length);
    }

    getAuthType() {
        return "OAuth2";
    }

    getAuthURL() {
        return this._ctx.authURL;
    }

    getRouter() {
        const router = new express.Router();

        router.get("/google/oauth2callback", async (req, res) => {
            try {
                const { tokens } = await this._ctx.oauth2.getToken(req.query.code);
                this._ctx.oauth2.credentials = tokens;
                res.json({
                    res: "Success"
                });
            } catch (err) {
                res.json({
                    res: "Failed",
                    description: "OAuth2 callback failed",
                    reason: JSON.stringify(err)
                });
            }
        });

        return router;
    }
}


/**
 * On Google calendar event command
 */
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
                // TODO @imblowfish: удалить комментарий после реализации интерфейса
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
    constructor() {
        super("Google Calendar", "https://www.googleapis.com/auth/calendar");
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
                calendarId: this._ctx.testCalendarID
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
