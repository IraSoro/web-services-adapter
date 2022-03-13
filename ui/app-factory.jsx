import React from "react";
import {
    Button,
    Stack,
    Select,
    TextField,
    MenuItem
} from "@mui/material";


const ReceiveMessage = (props) => {
    // TODO @imblowfish: Добавить разбор поддерживаемых чатов
    // TODO @imblowfish: Выровнять по центру
    const args = {
        chat: "Personal",
        message: ""
    };

    const checkArgs = () => {
        if (!args.chat || !args.message.length) {
            alert("Incorrect arguments");
            return;
        }
        props.onDone(args);
    };

    return (
        <Stack
            sx={{ width: "200px" }}
            justifyContent="center"
            spacing={2}
        >
            <Select
                sx={{ width: "200px" }}
                label="Chat"
                value="Personal"
                onChange={(event) => args.chat = event.target.value}
            >
                <MenuItem value={"Personal"}>Personal</MenuItem>
            </Select>
            <TextField
                label="On receive..."
                multiline
                onChange={(event) => args.message = event.target.value}
            />
            <Button
                variant="outlined"
                onClick={checkArgs}
            >
                OK
            </Button>
        </Stack>
    );
};

const SendMessage = (props) => {
    // TODO @imblowfish: Добавить разбор поддерживаемых чатов
    // TODO @imblowfish: Выровнять по центру
    const args = {
        chat: "Personal",
        message: ""
    };

    const checkArgs = () => {
        if (!args.chat || !args.message.length) {
            alert("Incorrect arguments");
            return;
        }
        props.onDone(args);
    };

    return (
        <Stack
            sx={{ width: "200px" }}
            justifyContent="center"
            spacing={2}
        >
            <Select
                sx={{ width: "200px" }}
                label="Chat"
                value="Personal"
                onChange={(event) => args.chat = event.target.value}
            >
                <MenuItem value={"Personal"}>Personal</MenuItem>
            </Select>
            <TextField
                label="Send message"
                multiline
                onChange={(event) => args.message = event.target.value}
            />
            <Button
                variant="outlined"
                onClick={checkArgs}
            >
                OK
            </Button>
        </Stack>
    );
};


class TelegramFactory {
    getActionComponent(actionName, props) {
        switch (actionName) {
            case "SendMessage":
                return <SendMessage {...props} />;
            default:
                throw new Error("Unknown trigger name");
        }
    }

    getTriggerComponent(triggerName, props) {
        switch (triggerName) {
            case "ReceiveMessage":
                return <ReceiveMessage {...props} />;
            default:
                throw new Error("Unknown trigger name");
        }
    }
}

export const AppFactory = (props) => {
    const createAppFactory = (appName) => {
        switch (appName) {
            case "Telegram":
                return new TelegramFactory();
            default:
                throw new Error("Unknown app name");
        }
    };
    const factory = createAppFactory(props.app);
    if (props.trigger) {
        return factory.getTriggerComponent(props.trigger, props);
    }
    return factory.getActionComponent(props.action, props);
};
