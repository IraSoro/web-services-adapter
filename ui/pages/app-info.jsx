import React from "react";
import { useParams } from "react-router-dom";
import {
    Avatar,
    Box,
    Button
} from "@mui/material";

import { PageWrapper } from "../components";


export const AppInfo = () => {
    const { appName } = useParams();

    const style = {
        display: "flex",
        justifyContent: "center",
        alignItems: "center"
    };

    return (
        <PageWrapper>
            <Box sx={style}>
                <Avatar variant="square" src={"/api/v1/apps/" + appName + "/icon"} />
            </Box>
            <Box sx={style}>
                <Button variant="outlined">Connect</Button>
            </Box>
        </PageWrapper>
    );
};
