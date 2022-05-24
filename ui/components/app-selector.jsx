import React, {
    useState,
    useEffect
} from "react";
import {
    useNavigate
} from "react-router-dom";
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
                width: "200px",
                height: "200px",
                cursor: "pointer"
            }}
            variant="outlined"
            onClick={() => props.onClick(props.name)}
        >
            <Avatar
                sx={{
                    width: "128px",
                    height: "128px"
                }}
                variant="square"
                src={`/icons/${props.icon}`}
            />
            <Typography
                component="h1"
                variant="h5"
                color="text.secondary"
            >
                {props.name}
            </Typography>
        </Paper>
    );
};

const AppsList = (props) => {
    const navigate = useNavigate();
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
                onClick={
                    app.connected
                        ? props.onAppClick
                        : () => navigate(`/apps/${app.name}`)
                }
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
