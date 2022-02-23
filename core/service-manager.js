import fs from "fs";

import YAML from "yaml";

import { Telegram } from "./services/telegram/telegram.js";

class ConfigManager {
    constructor(cfgFilePath) {
        this.__cfgFileContent = fs.readFileSync(cfgFilePath, "utf-8");
        this.__cfg = YAML.parse(this.__cfgFileContent);
    }

    getServiceConfig(serviceName) {
        console.log("Search service name in the config", serviceName);
        console.log(this.__cfg[serviceName.toLowerCase()]);
    }
}

export class ServiceManager {
    cfgManager = new ConfigManager("./config.yml");

    static createService(name) {
        switch (name) {
            case "Telegram":
                return new Telegram();
            // TODO @imblowfish: Добавлять новые сервисы сюда...
            default:
                throw new Error("[ServiceManager.getService] Unknown service name");
        }
    }
}
