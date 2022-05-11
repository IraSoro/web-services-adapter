import FastMQ from "fastmq";

// NOTE @imblowfish: https://github.com/arloliu/fastmq
export class FastMQServer {
    constructor(name) {
        this.__name = name;
        this.__server = FastMQ.Server.create(name);
    }

    async launch() {
        await this.__server.start();
    }
}

export function createChannel(channelName, serverName) {
    return new Promise((resolve, reject) => {
        FastMQ.Client.connect(channelName, serverName)
            .then((channel) => {
                resolve(channel);
            })
            .catch((err) => {
                reject(err);
            });
    });
}
