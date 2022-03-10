import React from "react";
import {
    Button,
    ButtonGroup,
    Stack
} from "@mui/material";
import {
    Link
} from "react-router-dom";


const LinkButton = (props) => {
    return (
        <Button component={Link}
            to={props.to}
        >
            {props.children}
        </Button>
    );
};

export const Header = () => {
    return (
        <Stack direction="row" justifyContent="end">
            <ButtonGroup variant="text">
                <LinkButton to="/">My Applets</LinkButton>
                <LinkButton to="/explore">Explore</LinkButton>
            </ButtonGroup>
        </Stack>
    );
};
