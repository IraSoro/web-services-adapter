import React, {
    Fragment,
    useState,
} from "react";
import {
    Container,
    Stack,
} from "@mui/material";

import {
    ApplicationsList,
    Header,
    Search
} from "./components";


const PageWrapper = (props) => {
    return (
        <Fragment>
            <Header />
            {props.children}
        </Fragment>
    );
};

export const MyApplets = () => {
    return (
        <PageWrapper>
            <h1>{"//TODO @imblowfish: Реализуй меня"}</h1>;
        </PageWrapper>
    );
};

export const Explore = () => {
    const [filter, setFilter] = useState("");

    return (
        <PageWrapper>
            <Stack>
                <Search onChange={(searchRequest) => setFilter(searchRequest)} />
                <Container>
                    <ApplicationsList filter={filter} />
                </Container>
            </Stack>
        </PageWrapper>
    );
};
