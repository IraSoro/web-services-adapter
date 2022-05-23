import Conf from "conf";

/* NOTE @imblowfish:
 * https://github.com/sindresorhus/conf
 * https://json-schema.org/understanding-json-schema/index.html
 */
const cfg = new Conf({
    cwd: ".config",
    configName: "common",
    schema: {
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
        }
    },
    migrations: {
        "0.1.1": (store) => {
            store.set("Auth", {
                secret: ""
            });
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
