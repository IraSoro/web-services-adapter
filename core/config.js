import fs from "fs";

import YAML from "yaml";


export class Config {
    constructor(cfgFile) {
        this.__cfgFileContent = fs.readFileSync(cfgFile, "utf-8");
        this.__cfg = YAML.parse(this.__cfgFileContent);
    }

    print() {
        console.log(this.__cfgFileContent);
    }

    getConfigForService(serviceName) {
        return this.__cfg[serviceName];
    }
}
