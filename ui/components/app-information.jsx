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
    Button
} from "@mui/material";


const ConnectButton = (props) => {
    /* FIXME @imblowfish: После того, как нажали Connect
     * и вошли в приложение кнопка не обновляется
     */
    const navigate = useNavigate();
    const [connection, setConnection] = useState({
        connected: false,
        authURL: ""
    });

    useEffect(() => {
        fetch(`/api/v1/apps/${props.name}`)
            .then((resp) => {
                return resp.ok
                    ? Promise.resolve(resp)
                    : Promise.reject(resp);
            })
            .then((resp) => {
                if (!resp.ok) {
                    throw new Error(`Response status ${resp.status}: ${resp.statusText}`);
                }
                return resp.json();
            })
            .then((app) => setConnection({
                connected: app.connected,
                authURL: app.authURL
            }))
            .catch((err) => {
                if (err?.status == 404) {
                    navigate("/NotFound");
                } 
                console.error(err);
            });
    }, []);

    if (connection.connected) {
        return (
            <Button
                variant="contained"
                onClick={() => navigate("/create")}
            >
                Create
            </Button>
        );
    }
    return (
        <Button
            variant="outlined"
            onClick={() => globalThis.open(connection.authURL, "_blank")}
        >
            Connect
        </Button>
    );
};

export const AppInformation = (props) => {
    return (
        <Box
            sx={{
                display: "flex",
                flexDirection: "column",
                justifyContent: "center",
                alignItems: "center"
            }}
        >
            <Avatar
                variant="square"
                src={`/api/v1/apps/${props.name}/icon`}
            />
            <ConnectButton name={props.name} />
        </Box>
    );
};
