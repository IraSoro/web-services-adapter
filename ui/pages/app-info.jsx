import React, {
    useState,
    useEffect
} from "react";
import {
    useParams,
    useNavigate
} from "react-router-dom";
import {
    Avatar,
    Box,
    Button
} from "@mui/material";

import { PageWrapper } from "../components";


const ActionButton = (props) => {
    const navigate = useNavigate();

    const [connectURL, setConnectURL] = useState("");

    useEffect(() => {
        fetch(`/api/v1/connect/${props.appName}`)
            .then((resp) => resp.json())
            .then((res) => setConnectURL(res.authURL))
            .catch((err) => console.error(err));
    }, []);

    console.log("connectURL", connectURL);

    if (props.connected) {
        return (
            <Button variant="contained"
                onClick={() => navigate("/createApplet")}
            >
                Create
            </Button>
        );
    } else {
        return (
            <Button variant="outlined"
                onClick={() => window.open(connectURL, "_blank")}
            >
                Connect
            </Button>
        );
    }
};


export const AppInfo = () => {
    const { appName } = useParams();

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
    }, [connected]);

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
                <ActionButton appName={appName} connected={connected} />
            </Box>
        </PageWrapper>
    );
};
