import fs from "fs";

export class Config {
    constructor(cfgFile) {
        this.__cfgFileContent = fs.readFileSync(cfgFile, "utf-8");
        this.__cfg = JSON.parse(this.__cfgFileContent);
    }

    print() {
        console.log(this.__cfgFileContent);
    }

    getConfigForService(serviceName) {
        return this.__cfg[serviceName];
    }
}
