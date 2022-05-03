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
    return (
        <Stack direction="row" justifyContent="end">
            <ButtonGroup variant="text">
                <Button onClick={() => navigate("/")}>My Applets</Button>
                <Button onClick={() => navigate("/explore")}>Explore</Button>
                <Button variant="outlined" onClick={() => navigate("/create")}>Create</Button>
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

