import React, { useState } from "react";
import {
    Button,
    Stack,
    Select,
    TextField,
    MenuItem
} from "@mui/material";

const SendRequestAction = (props) => {
    const [method, setMethod] = useState("GET");
    const [url, setUrl] = useState("");
    const [requestType, setRequestType] = useState("Plain text");
    const [body, setBody] = useState("");

    const isValidArguments = () => {
        const protocol = new URL(url).protocol;
        return method && url && requestType
            && (protocol == "http:" || protocol == "https:");
    };

    return (
        <Stack
            alignItems="center"
            spacing={0.5}
            mt={2}
        >
            <Select
                sx={{ width: "20%" }}
                label="Method"
                value={method}
                onChange={(event) => setMethod(event.target.value)}
            >
                <MenuItem value="GET">GET</MenuItem>
                <MenuItem value="POST">POST</MenuItem>
            </Select>
            <TextField
                sx={{ width: "20%" }}
                label="URL"
                onChange={(event) => setUrl(event.target.value)}
            />
            <Select
                sx={{ width: "20%" }}
                label="Request Type"
                value={requestType}
                onChange={(event) => setRequestType(event.target.value)}
            >
                <MenuItem value="Plain text">Plain text</MenuItem>
                <MenuItem value="JSON">JSON</MenuItem>
            </Select>
            <TextField
                sx={{ width: "20%" }}
                label="Body"
                multiline
                rows={10}
                onChange={(event) => setBody(event.target.value)}
            />
            <Button
                sx={{ width: "20%" }}
                variant="outlined"
                onClick={() => {
                    if (isValidArguments()) {
                        props.onDone({
                            method: method,
                            url: url,
                            requestType: requestType,
                            body: body ? JSON.parse(body) : undefined
                        });
                    }
                }}
            >
                Ok
            </Button>
        </Stack>
    );
};

export class WebhookFactory {
    createAction(name, props) {
        switch (name) {
            case "Send Request":
                return <SendRequestAction {...props} />;
            default:
                throw new Error("Unknown action name");
        }
    }
}
