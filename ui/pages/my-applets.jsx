import React, {
    useState,
    useEffect
} from "react";
import { useNavigate } from "react-router-dom";
import {
    Container,
    Paper,
    Stack,
    Switch,
    IconButton,
    Typography,
    Grid
} from "@mui/material";
import DeleteIcon from "@mui/icons-material/Delete";

import { PageWrapper } from "../components";


const AppletCard = (props) => {
    const navigate = useNavigate();
    const [needUpdate, setNeedUpdate] = useState(true);
    const [applet, setApplet] = useState({});

    useEffect(() => {
        fetch(`/api/v1/applets/${props.id}`, {
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
            .then((applet) => setApplet(applet))
            .catch((err) => {
                if (err.message == 401) {
                    navigate("/signIn");
                }
                console.error(err);
            });
    }, [needUpdate]);

    const runTimesInfo = applet.counter
        ? `Run ${applet.counter} times`
        : "Never run";

    return (
        <Paper
            sx={{
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                justifyContent: "center",
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
            <Typography
                variant="body2"
                color="text.secondary"
            >
                {runTimesInfo}
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
                                "Authorization": `${localStorage.getItem("TokenType")} ${localStorage.getItem("AccessToken")}`,
                                "Content-Type": "application/json"
                            },
                            body: JSON.stringify({
                                active: event.target.checked
                            })
                        })
                            .then((resp) => {
                                if (!resp.ok) {
                                    throw new Error(resp.status);
                                }
                            })
                            .then(() => setNeedUpdate(!needUpdate))
                            .catch((err) => {
                                if (err.message == 401) {
                                    navigate("/signIn");
                                }
                                console.error(err);
                            });
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
    const navigate = useNavigate();
    const [needUpdate, setNeedUpdate] = useState(false);
    const [applets, setApplets] = useState([]);

    useEffect(() => {
        fetch("/api/v1/applets", {
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
            .then((applets) => setApplets(applets))
            .catch((err) => {
                console.error(err);
                navigate("/signIn");
            });
    }, [needUpdate]);

    const appletCards = [];
    for (const applet of applets) {
        appletCards.push(
            <Grid
                item
                xs={12}
                key={applet.uuid}
            >
                <AppletCard
                    key={applet.uuid}
                    id={applet.uuid}
                    onDeleteApplet={(id) => {
                        fetch(`/api/v1/applets/${id}`, {
                            method: "DELETE",
                            headers: {
                                "Accept": "application/json",
                                "Authorization": `${localStorage.getItem("TokenType")} ${localStorage.getItem("AccessToken")}`
                            }
                        })
                            .then((resp) => {
                                if (!resp.ok) {
                                    throw new Error(resp.status);
                                }
                            })
                            .then(() => setNeedUpdate(!needUpdate))
                            .catch((err) => {
                                if (err.message == 401) {
                                    navigate("/signIn");
                                }
                                console.error(err);
                            });
                    }}
                />
            </Grid>
        );
    }

    return (
        <Grid container spacing={3}>
            {appletCards}
        </Grid>
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
