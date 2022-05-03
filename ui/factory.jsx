import { TelegramFactory } from "./factories/telegram";


class UnknownApplicationError extends Error {
    constructor(unknownAppName) {
        const msg = `Unknown application name, ${unknownAppName}`;
        super(msg);
        this.name = "UnknownApplicationError";
    }
}

export const AppFactory = (props) => {
    const factories = {
        "Telegram": TelegramFactory,
    };
    if (!Object.keys(factories).includes(props.app)) {
        throw new UnknownApplicationError(props.app);
    }
    const factory = new factories[props.app];
    if (props.trigger) {
        return factory.createTrigger(props.trigger, props);
    }
    return factory.createAction(props.action, props);
};
