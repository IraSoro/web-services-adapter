import React, {
    Fragment
} from "react";
import {
    Link
} from "react-router-dom";
import {
    Button,
    ButtonGroup,
    Stack
} from "@mui/material";


const LinkButton = (props) => {
    return (
        <Button component={Link}
            to={props.to}
        >
            {props.children}
        </Button>
    );
};

const Header = () => {
    return (
        <Stack direction="row" justifyContent="end">
            <ButtonGroup variant="text">
                <LinkButton to="/">My Applets</LinkButton>
                <LinkButton to="/explore">Explore</LinkButton>
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

