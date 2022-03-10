import React from "react";
import {
    Avatar,
    Box,
    Card,
    CardContent,
    Typography
} from "@mui/material";


export const ApplicationCard = (props) => {
    const style = {
        display: "flex",
        justifyContent: "center",
        alignItems: "center"
    };
    return (
        <Card variant="outlined"
            onClick={props.onClick}
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
