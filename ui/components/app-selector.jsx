import React, {
    useState,
    useEffect
} from "react";
import {
    Avatar,
    Container,
    Stack,
    Typography,
    Paper
} from "@mui/material";

import { Search } from "../components";


const AppCard = (props) => {
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
            onClick={() => props.onClick(props.name)}
        >
            <Avatar
                variant="square"
                src={`/icons/${props.icon}`}
            />
            <Typography
                variant="body2"
                color="text.secondary"
            >
                {props.name}
            </Typography>
        </Paper>
    );
};

const AppsList = (props) => {
    const [apps, setApps] = useState([]);

    useEffect(() => {
        fetch(`/api/v1/apps/${props.filter ?? ""}/search`, {
            headers: {
                "Authorization": `${localStorage.getItem("TokenType")} ${localStorage.getItem("AccessToken")}`
            }
        })
            .then((resp) => {
                if (!resp.ok) {
                    throw new Error(resp.status);
                }
                return resp.json();
            })
            .then((apps) => {
                if (props.triggersOnly) {
                    return setApps(apps.filter((app) => app.triggers.length > 0));
                } else if (props.actionsOnly) {
                    return setApps(apps.filter((app) => app.actions.length > 0));
                }
                return setApps(apps);
            })
            .catch((err) => {
                console.error(err);
            });
    }, [props.filter]);

    const appCards = apps.map((app) => {
        return (
            <AppCard
                key={app.name}
                name={app.name}
                icon={app.icon}
                onClick={() => props.onAppClick(app.name)}
            />
        );
    });

    return (
        <Stack
            direction="row"
            justifyContent="center"
            padding={2}
            spacing={2}
        >
            {appCards}
        </Stack>
    );
};

export const AppSelector = (props) => {
    const [filter, setFilter] = useState("");

    return (
        <Stack>
            <Search onChange={(searchRequest) => setFilter(searchRequest)} />
            <Container>
                <AppsList
                    filter={filter}
                    actionsOnly={props.actionsOnly}
                    triggersOnly={props.triggersOnly}
                    onAppClick={props.onAppClick}
                />
            </Container>
        </Stack>
    );
};
