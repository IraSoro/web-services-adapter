import { GoogleCalendar } from "./apps/google.js";
import { Telegram } from "./apps/telegram.js";


class AppManager {
    getSupportedApps() {
        return [
            "Google Calendar",
            "Telegram"
        ];
    }

    createAppInstance(appName, appContext) {
        switch (appName) {
            case "Google Calendar":
                return new GoogleCalendar(appContext);
            case "Telegram":
                return new Telegram(appContext);
            default:
                throw Error("Unknown app name");
        }
    }
}

class IconManager {
    getIconPathByAppName(appName) {
        /* 
         * NOTE @imblowfish: Имена файлов в ./core/apps/icons,
         * обычно качаю их отсюда качаю их обычно отсюда https://icons8.com/
         */
        switch (appName) {
            case "Google Calendar":
                return "icons8-google-calendar-48.png";
            case "Telegram":
                return "icons8-telegram-app-48.png";
            default:
                return "icons8-blank-48.png";
        }
    }
}

const appManager = new AppManager();
const iconManager = new IconManager();

export { appManager, iconManager };
