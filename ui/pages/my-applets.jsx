import React, {
    useState,
    useEffect
} from "react";
import {
    Container,
    Paper,
    Stack,
    Switch,
    IconButton,
    Typography
} from "@mui/material";
import DeleteIcon from "@mui/icons-material/Delete";

import { PageWrapper } from "../components";


const AppletCard = (props) => {
    const [needUpdate, setNeedUpdate] = useState(true);
    const [applet, setApplet] = useState({});

    useEffect(() => {
        fetch(`/api/v1/applets/${props.id}`)
            .then((resp) => resp.json())
            .then((applet) => setApplet(applet))
            .catch((err) => console.error(err));
    }, [needUpdate]);

    return (
        <Paper
            sx={{
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                justifyContent: "center",
                width: "150px",
                height: "150px",
                cursor: "pointer"
            }}
            variant="outlined"
        >
            <Typography
                variant="body2"
                color="text.secondary"
            >
                {applet.name}
            </Typography>
            <Stack
                direction="row"
                justifyContent="space-between"
            >
                <Switch
                    color="primary"
                    checked={Boolean(applet.active)}
                    onChange={(event) => {
                        fetch(`/api/v1/applets/${props.id}`, {
                            method: "POST",
                            headers: {
                                "Accept": "application/json",
                                "Content-Type": "application/json"
                            },
                            body: JSON.stringify({
                                active: event.target.checked
                            })
                        })
                            .then((resp) => resp.json())
                            .then(() => setNeedUpdate(!needUpdate))
                            .catch((err) => console.error(err));
                    }}
                />
                <IconButton
                    onClick={() => props.onDeleteApplet(props.id)}
                >
                    <DeleteIcon />
                </IconButton>
            </Stack>

        </Paper >
    );
};

const AppletsList = () => {
    const [needUpdate, setNeedUpdate] = useState(false);
    const [applets, setApplets] = useState({});

    useEffect(() => {
        // TODO @imblowfish: Обращение к API для получения списка апплетов
        fetch("/api/v1/applets")
            .then((resp) => resp.json())
            .then((applets) => setApplets(applets))
            .catch((err) => console.error(err));
    }, [needUpdate]);

    const appletCards = [];
    for (const id of Object.keys(applets)) {
        appletCards.push(
            <AppletCard
                key={id}
                id={id}
                onDeleteApplet={(id) => {
                    fetch(`/api/v1/applets/${id}`, {
                        method: "DELETE",
                        headers: {
                            "Accept": "application/json"
                        }
                    })
                        .then((resp) => resp.json())
                        .then(() => setNeedUpdate(!needUpdate))
                        .catch((err) => console.error(err));
                }}
            />
        );
    }

    return (
        <Stack
            direction="row"
            justifyContent="center"
            padding={2}
            spacing={2}
        >
            {appletCards}
        </Stack>
    );
};

export const MyApplets = () => {
    return (
        <PageWrapper>
            <Container>
                <AppletsList />
            </Container>
        </PageWrapper>
    );
};
