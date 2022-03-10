import React, {
    useState,
} from "react";
import {
    Container,
    Stack,
} from "@mui/material";

import {
    Search,
    ApplicationsList
} from "./components";


export const ExploreAppsPage = () => {
    const [filter, setFilter] = useState("");

    return (
        <Stack>
            <Search onChange={(searchRequest) => setFilter(searchRequest)} />
            <Container>
                <ApplicationsList filter={filter} />
            </Container>
        </Stack>
    );
};
