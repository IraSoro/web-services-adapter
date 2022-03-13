import React from "react";
import {
    Button,
    Stack,
    Select,
    MenuItem,
    TextField
} from "@mui/material";

import { BaseFactory } from "./base-factory";


// Actions
const SendMessageAction = (props) => {
    const args = {
        chat: "Personal",
        message: ""
    };

    const setChat = (newChat) => args.chat = newChat;
    const setMessage = (newMessage) => args.message = newMessage;

    const isValidArguments = () => {
        return args.chat && args.message.length;
    };

    return (
        <Stack sx={{ width: "200px" }}>
            <Select
                label="Chat"
                value={args.chat}
                onChange={(event) => setChat(event.target.value)}
            >
                <MenuItem value={"Personal"}>Personal</MenuItem>
            </Select>
            <TextField
                label="Send message..."
                multiline
                onChange={(event) => setMessage(event.target.value)}
            />
            <Button
                variant="outlined"
                onClick={() => {
                    if (isValidArguments()) {
                        props.onDone();
                    }
                }}
            >
                Ok
            </Button>
        </Stack>
    );
};

// Triggers
const ReceiveMessageTrigger = (props) => {
    const args = {
        chat: "Personal",
        message: ""
    };

    const setChat = (newChat) => args.chat = newChat;
    const setMessage = (newMessage) => args.message = newMessage;

    const isValidArguments = () => {
        return args.chat && args.message.length;
    };

    return (
        <Stack sx={{ width: "200px" }}>
            <Select
                label="Chat"
                value={args.chat}
                onChange={(event) => setChat(event.target.value)}
            >
                <MenuItem value={"Personal"}>Personal</MenuItem>
            </Select>
            <TextField
                label="On receive..."
                multiline
                onChange={(event) => setMessage(event.target.value)}
            />
            <Button
                variant="outlined"
                onClick={() => {
                    if (isValidArguments()) {
                        props.onDone();
                    }
                }}
            >
                OK
            </Button>
        </Stack>
    );
};

export class TelegramFactory extends BaseFactory {
    createAction(name, props) {
        switch (name) {
            case "SendMessage":
                return <SendMessageAction {...props} />;
            default:
                throw new Error("Unknown trigger name");
        }
    }

    createTrigger(name, props) {
        switch (name) {
            case "ReceiveMessage":
                return <ReceiveMessageTrigger {...props} />;
            default:
                throw new Error("Unknown trigger name");
        }
    }
}
