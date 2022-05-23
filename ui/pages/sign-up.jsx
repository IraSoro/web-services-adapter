import React from "react";

import { encode } from "js-base64";
import { useNavigate } from "react-router-dom";
import {
    Box,
    Button,
    Container,
    TextField,
    Typography,
    Link
} from "@mui/material";


export const SignUp = () => {
    const navigate = useNavigate();

    const handleSubmit = (event) => {
        event.preventDefault();
        const data = new FormData(event.currentTarget);
        const username = data.get("username");
        const password = data.get("password");
        const auth = `${username}:${password}`;

        fetch("/api/v1/auth/signUp", {
            method: "POST",
            headers: {
                "Authorization": `Basic ${encode(auth)}`
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
        <Container
            component="main"
            maxWidth="xs"
        >
            <Box
                sx={{
                    marginTop: 8,
                    display: "flex",
                    flexDirection: "column",
                    alignItems: "center"
                }}
            >
                <Typography component="h1" variant="h5">
                    Sign Up
                </Typography>
                <Box
                    component="form"
                    onSubmit={handleSubmit}
                    noValidate
                    sx={{ mt: 3 }}
                >
                    <TextField
                        required
                        margin="normal"
                        label="Username"
                        name="username"
                        variant="outlined"
                        autoFocus
                        fullWidth
                    />
                    <TextField
                        required
                        margin="normal"
                        label="Password"
                        name="password"
                        variant="outlined"
                        type="password"
                        autoComplete="current-password"
                        fullWidth
                    />
                    <Button
                        type="submit"
                        fullWidth
                        variant="contained"
                        sx={{ mt: 3, mb: 2 }}
                    >
                        Sign Up
                    </Button>
                    <Link
                        href="/signIn"
                        variant="body2"
                    >
                        {"Already have an account? Sign in"}
                    </Link>
                </Box>
            </Box>
        </Container>
    );
};
