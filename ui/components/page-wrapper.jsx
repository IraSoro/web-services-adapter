import React, {
    Fragment
} from "react";
import {
    useNavigate
} from "react-router-dom";
import {
    Button,
    ButtonGroup,
    Container,
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
        <Fragment>
            <Stack direction="row" justifyContent="end">
                <ButtonGroup variant="text">
                    <Button variant="contained" onClick={handleLogout}>Logout</Button>
                </ButtonGroup>
            </Stack>
            <Stack direction="row" justifyContent="center" sx={{ mb: 5 }}>
                <ButtonGroup variant="text">
                    <Button variant="outlined" onClick={() => navigate("/")}>My Applets</Button>
                    <Button variant="outlined" onClick={() => navigate("/explore")}>Explore</Button>
                    <Button variant="outlined" onClick={() => navigate("/create")}>Create</Button>
                </ButtonGroup>
            </Stack>

        </Fragment>

    );
};

export const PageWrapper = (props) => {
    return (
        <Container>
            <Header />
            {props.children}
        </Container>
    );
};

