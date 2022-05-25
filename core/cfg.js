import Conf from "conf";

/* NOTE @imblowfish:
 * https://github.com/sindresorhus/conf
 * https://json-schema.org/understanding-json-schema/index.html
 */
const cfg = new Conf({
    cwd: ".config",
    configName: "common",
    schema: {
        Settings: {
            type: "object",
            properties: {
                host: { type: "string" },
                port: { type: "number" }
            }
        },
        Auth: {
            type: "object",
            properties: {
                secret: { type: "string" }
            }
        },
        Telegram: {
            type: "object",
            properties: {
                token: { type: "string" },
                botURL: { type: "string" },
                redirectURI: { type: "string" },
                chatID: { type: "number" },
                username: { type: "string" }
            }
        },
        Google: {
            type: "object",
            properties: {
                clientID: { type: "string" },
                clientSecret: { type: "string" },
                redirectURI: { type: "string" }
            }
        },
        Cron: { type: "object"},
        Webhook: { type: "object" }
    },
    // TODO @imblowfish: сменить тут версию на 0.2.0 при релизе
    migrations: {
        "0.1.2": (store) => {
            store.set("Auth", {
                secret: "<some_secret_here>"
            });
            store.set("Settings", {
                host: "localhost",
                port: 3000
            });
            store.set("Webhook", {});
        }
    }
});

export function getConfig(appName) {
    if (!cfg.has(appName)) {
        throw new Error(`Cannot found ${appName} config`);
    }
    /* NOTE @imblowfish: Создаем прокси, чтобы обновлять файл
     * конфигурации при каждом изменении его свойств 
     */
    return new Proxy(cfg.get(appName), {
        set(target, prop, value) {
            cfg.set(`${appName}.${prop}`, value);
            return Reflect.set(target, prop, value);
        }
    });
}
