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
                src={`/api/v1/apps/${props.name}/icon`}
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
        fetch(`/api/v1/apps${props.filter ?? ""}`)
            .then((resp) => resp.json())
            .then((apps) => setApps(apps.map((app) => app.name)))
            .catch((err) => console.error(err));
    }, [props.filter]);

    const appCards = apps.map((app) => {
        return (
            <AppCard
                key={app}
                name={app}
                onClick={props.onAppClick}
            />
        );
    });

    return (
        <Stack
            direction="row"
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
                    onAppClick={props.onAppClick}
                />
            </Container>
        </Stack>
    );
};
