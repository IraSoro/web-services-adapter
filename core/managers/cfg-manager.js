import fs from "fs";


/* NOTE @imblowfish: Можно не обращать особое внимание на код здесь,
в дальнейшем будет заменено на готовый пакет */

class SaveConfigurationError extends Error {
    constructor() {
        super("Cannot save new configuration");
        this.name = SaveConfigurationError;
    }
}

class ConfigManager {
    constructor() {
        this.__configFilePath = "./cfg/config.json";
        console.log("Read config file");
        this.__cfg = JSON.parse(fs.readFileSync(this.__configFilePath, "utf-8"));
        console.log(this.__cfg);
    }

    async __save() {
        try {
            await fs.promises.writeFile(this.__configFilePath,
                JSON.stringify(this.__cfg, null, 4),
                "utf-8");
        } catch (err) {
            throw new SaveConfigurationError();
        }
    }

    getAppContext(appName) {
        if (!Object.keys(this.__cfg).includes(appName)) {
            this.__cfg[appName] = {};
        }

        /*
         * NOTE @imblowfish: Внутри handler this потеряется и будет
         * указывать на функцию set, поэтому сохраняем контекст this
         */
        const instance = this;
        const handler = {
            set(target, prop, value) {
                const res = Reflect.set(target, prop, value);
                instance.__save();
                return res;
            }
        };

        /*
         * NOTE @imblowfish: Создаем прокси, чтобы обновлять файл
         * конфигурации при каждом изменении его свойств внутри
         */
        return new Proxy(this.__cfg[appName], handler);
    }
}

export const cfgManager = new ConfigManager();
