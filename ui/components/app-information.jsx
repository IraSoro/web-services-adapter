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
    const navigate = useNavigate();
    const [connection, setConnection] = useState({
        connected: false,
        authURL: ""
    });

    useEffect(() => {
        fetch(`/api/v1/apps/${props.name}`, {
            headers: {
                "Authorization": `${localStorage.getItem("TokenType")} ${localStorage.getItem("AccessToken")}`
            }
        })
            .then((resp) => {
                return resp.ok
                    ? Promise.resolve(resp)
                    : Promise.reject(resp);
            })
            .then((resp) => {
                if (!resp.ok) {
                    throw new Error(resp.status);
                }
                return resp.json();
            })
            .then((app) => setConnection({
                connected: app.connected,
                authURL: app.authURL
            }))
            .catch((err) => {
                if (err.message == 404) {
                    navigate("/NotFound");
                } else if (err.message == 401) {
                    navigate("/signIn");
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
    const [iconPath, setIconPath] = useState("");

    useEffect(() => {
        fetch(`/api/v1/apps/${props.name}`, {
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
            .then((json) => {
                setIconPath(`/icons/${json.icon}`);
            });
    }, []);

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
                src={iconPath}
            />
            <ConnectButton name={props.name} />
        </Box>
    );
};
