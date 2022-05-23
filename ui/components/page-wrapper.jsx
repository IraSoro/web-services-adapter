import React, {
    Fragment
} from "react";
import {
    useNavigate
} from "react-router-dom";
import {
    Button,
    ButtonGroup,
    Stack
} from "@mui/material";


const Header = () => {
    const navigate = useNavigate();

    const handleLogout = () => {
        fetch("/api/v1/auth/logout", {
            method: "POST",
            headers: {
                "Authorization": `${localStorage.getItem("TokenType")} ${localStorage.getItem("AccessToken")}`
            }
        })
            .then((resp) => {
                if (!resp.ok) {
                    throw new Error(`Response status ${resp.status}: ${resp.statusText}`);
                }
                navigate("/signIn");
            })
            .catch((err) => {
                console.error(err);
            });
    };

    return (
        <Stack direction="row" justifyContent="end">
            <ButtonGroup variant="text">
                <Button onClick={() => navigate("/")}>My Applets</Button>
                <Button onClick={() => navigate("/explore")}>Explore</Button>
                <Button variant="outlined" onClick={() => navigate("/create")}>Create</Button>
                <Button variant="contained" onClick={handleLogout}>Logout</Button>
            </ButtonGroup>
        </Stack>
    );
};

export const PageWrapper = (props) => {
    return (
        <Fragment>
            <Header />
            {props.children}
        </Fragment>
    );
};

