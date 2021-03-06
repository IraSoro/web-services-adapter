import React, { useState } from "react";
import {
    Button,
    Stack,
    TextField
} from "@mui/material";
import { isValidCron } from "cron-validator";

const OnScheduleTrigger  = (props) => {
    const [timing, setTiming] = useState("");

    const isValidate = () => {
        return isValidCron(timing);
    };

    return (
        <Stack
            alignItems="center"
            spacing={0.5}
            mt={2}
        >
            <TextField
                sx={{ width: "30%" }}
                label="Input time..."
                multiline
                onChange={(event) => setTiming(event.target.value)}
            />
            
            <Button
                sx={{ width: "30%" }}
                variant="outlined"
                onClick={() => {
                    if (isValidate()) {
                        props.onDone({
                            timing: timing
                        });
                    }
                }}
            >
                OK
            </Button>
        </Stack>
    );
};

export class CronFactory {
    createTrigger(name, props) {
        switch (name) {
            case "On Schedule":
                return <OnScheduleTrigger  {...props} />;
            default:
                throw new Error("Unknown action name");
        }
    }
}