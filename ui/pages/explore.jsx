import React, {
    useState,
    useEffect
} from "react";
import {
    useNavigate
} from "react-router-dom";
import {
    Avatar,
    Box,
    Card,
    CardContent,
    Container,
    Stack,
    Typography
} from "@mui/material";

import {
    PageWrapper,
    Search
} from "../components";


const ApplicationCard = (props) => {
    const navigate = useNavigate();
    const style = {
        display: "flex",
        justifyContent: "center",
        alignItems: "center"
    };
    return (
        <Card variant="outlined"
            onClick={() => navigate("/apps/" + props.name)}
            to={"/apps/" + props.name}
            sx={{
                ...style,
                width: "150px",
                height: "150px",
                cursor: "pointer"
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

const ApplicationsList = (props) => {
    const [apps, setApps] = useState([]);

    useEffect(() => {
        fetch(`/api/v1/apps/${props.filter ?? ""}`)
            .then((resp) => resp.json())
            .then((apps) => {
                setApps(apps.map((app) => {
                    return <ApplicationCard key={app.name} name={app.name} />;
                }));
            })
            .catch((err) => console.error(err));
    }, [props.filter]);

    return (
        <Stack direction="row" padding={2} spacing={2}>
            {apps}
        </Stack>
    );
};

export const Explore = () => {
    const [filter, setFilter] = useState("");

    return (
        <PageWrapper>
            <Stack>
                <Search onChange={(searchRequest) => setFilter(searchRequest)} />
                <Container>
                    <ApplicationsList filter={filter} />
                </Container>
            </Stack>
        </PageWrapper>
    );
};
