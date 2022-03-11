import React, {
    useState,
    useEffect
} from "react";
import { useParams } from "react-router-dom";
import {
    Avatar,
    Box,
    Button
} from "@mui/material";

import { PageWrapper } from "../components";


export const AppInfo = () => {
    const [connected, setConnected] = useState(false);

    useEffect(() => {
        fetch(`/api/v1/apps/${appName}`)
            .then((resp) => resp.json())
            .then((apps) => {
                if (!apps.length) {
                    return;
                }
                setConnected(apps[0].connected);
            })
            .catch((err) => console.error(err));
    }, []);

    const { appName } = useParams();

    const style = {
        display: "flex",
        justifyContent: "center",
        alignItems: "center"
    };

    const actionButton = connected ? <Button variant="contained">Create</Button>
        : <Button variant="outlined">Connect</Button>;

    return (
        <PageWrapper>
            <Box sx={style}>
                <Avatar variant="square" src={"/api/v1/apps/" + appName + "/icon"} />
            </Box>
            <Box sx={style}>
                {actionButton}
            </Box>
        </PageWrapper>
    );
};
