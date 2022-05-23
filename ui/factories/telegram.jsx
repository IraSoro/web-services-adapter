import React, {
    useState,
    useEffect
} from "react";
import {
    Button,
    Stack,
    Select,
    MenuItem,
    TextField
} from "@mui/material";


// Actions
const SendMessageAction = (props) => {
    const [chats, setChats] = useState([]);

    const args = {
        chatID: chats[0] ? chats[0].chatID : 0,
        message: ""
    };

    useEffect(() => {
        fetch("/telegram/chats", {
            headers: {
                "Authorization": `${localStorage.getItem("TokenType")} ${localStorage.getItem("AccessToken")}`
            }
        })
            .then((resp) => resp.json())
            .then((chats) => setChats(chats))
            .catch((err) => console.error(err));
    }, []);

    const setChat = (newChat) => args.chatID = newChat;
    const setMessage = (newMessage) => args.message = newMessage;

    const isValidArguments = () => {
        return args.chatID && Boolean(args.message.length);
    };

    const chatItems = [];
    for (const chat of chats) {
        chatItems.push(
            <MenuItem
                key={chat.chatID}
                value={chat.chatID}
            >
                {chat.username}
            </MenuItem>
        );
    }

    return (
        <Stack
            alignItems="center"
            spacing={0.5}
            mt={2}
        >
            <Select
                sx={{ width: "20%" }}
                label="Chat"
                value={chats[0] ? chats[0].chatID : ""}
                onChange={(event) => setChat(event.target.value)}
            >
                {chatItems}
            </Select>
            <TextField
                sx={{ width: "20%" }}
                label="Send message..."
                multiline
                onChange={(event) => setMessage(event.target.value)}
            />
            <Button
                sx={{ width: "20%" }}
                variant="outlined"
                onClick={() => {
                    if (isValidArguments()) {
                        props.onDone(args);
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
    const [chats, setChats] = useState([]);

    const args = {
        chatID: chats[0] ? chats[0].chatID : 0,
        message: ""
    };

    useEffect(() => {
        fetch("/telegram/chats", {
            headers: {
                "Authorization": `${localStorage.getItem("TokenType")} ${localStorage.getItem("AccessToken")}`
            }
        })
            .then((resp) => resp.json())
            .then((chats) => setChats(chats))
            .catch((err) => console.error(err));
    }, []);

    const setChat = (newChat) => {
        args.chatID = newChat;
    };
    const setMessage = (newMessage) => {
        args.message = newMessage;
    };

    const isValidArguments = () => {
        return args.chatID && Boolean(args.message.length);
    };

    const chatItems = [];
    for (const chat of chats) {
        chatItems.push(
            <MenuItem
                key={chat.chatID}
                value={chat.chatID}
            >
                {chat.username}
            </MenuItem>
        );
    }

    return (
        <Stack
            alignItems="center"
            spacing={0.5}
            mt={2}
        >
            <Select
                sx={{ width: "20%" }}
                label="Chat"
                value={chats[0] ? chats[0].chatID : ""}
                onChange={(event) => setChat(event.target.value)}
            >
                {chatItems}
            </Select>
            <TextField
                sx={{ width: "20%" }}
                label="On receive..."
                multiline
                onChange={(event) => setMessage(event.target.value)}
            />
            <Button
                sx={{ width: "20%" }}
                variant="outlined"
                onClick={() => {
                    if (isValidArguments()) {
                        props.onDone(args);
                    }
                }}
            >
                OK
            </Button>
        </Stack>
    );
};

export class TelegramFactory {
    createAction(name, props) {
        switch (name) {
            case "Send Message":
                return <SendMessageAction {...props} />;
            default:
                throw new Error("Unknown trigger name");
        }
    }

    createTrigger(name, props) {
        switch (name) {
            case "Receive Message":
                return <ReceiveMessageTrigger {...props} />;
            default:
                throw new Error("Unknown trigger name");
        }
    }
}
