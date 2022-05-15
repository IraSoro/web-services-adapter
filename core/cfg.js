import Conf from "conf";

/* NOTE @imblowfish:
 * https://github.com/sindresorhus/conf
 * https://json-schema.org/understanding-json-schema/index.html
 */
const cfg = new Conf({
    cwd: ".config",
    configName: "common",
    schema: {
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
    }
});

function getAppContext(appName) {
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

const appletsStorage = new Conf({
    cwd: ".config",
    configName: "applets"
});


export {
    getAppContext,
    appletsStorage as AppletsStorage
};
