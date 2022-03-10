import React, {
    Fragment,
    useState,
    useEffect,
} from "react";

import {
    Avatar,
    Box,
    Card,
    CardContent,
    Container,
    Stack,
    TextField,
    Typography
} from "@mui/material";

import SearchIcon from "@mui/icons-material/Search";


const Search = (props) => {
    return (
        <Box sx={{
            mx: "auto",
            padding: 2,
            display: "flex",
            alignItems: "center"
        }}>
            <SearchIcon fontSize="large" />
            <TextField label="Search..." onChange={props.onChange} />
        </Box>
    );
};

const AppIcon = (props) => {
    const style = {
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
    };
    return (
        <Card variant="outlined"
            sx={{
                ...style,
                width: "150px",
                height: "150px"
            }}
        >
            <CardContent>
                <Box sx={style}>
                    <Avatar variant="square" src={"/api/v1/apps/" + props.name + "/icon"} />
                </Box>
                <Box sx={style}>
                    <Typography sx={{ fontSize: 14 }} color="text.secondary">
                        {props.name}
                    </Typography>
                </Box>
            </CardContent>
        </Card>

    );
};

const AppsList = (props) => {
    const [apps, setApps] = useState([]);

    useEffect(() => {
        fetch(`/api/v1/apps/${props.pattern}`)
            .then((resp) => resp.json())
            .then((apps) => setApps(apps.map((app) => <AppIcon key={app} name={app} />)))
            .catch((err) => console.error(err));
    }, [props.pattern]);

    return (
        <Container>
            <Stack direction="row" padding={2} spacing={2}>
                {apps}
            </Stack>
        </Container>
    );
};

export const ExploreAppsPage = () => {
    const [pattern, setPattern] = useState("");

    return (
        <Stack>
            <Search onChange={(event) => setPattern(event.target.value)} />
            <AppsList pattern={pattern} />
        </Stack>
    );
};
