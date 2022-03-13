import React from "react";
import {
    useParams,
} from "react-router-dom";

import {
    PageWrapper,
    AppInformation
} from "../components";


export const AppPage = () => {
    const { appName } = useParams();

    return (
        <PageWrapper>
            <AppInformation name={appName} />
        </PageWrapper>
    );
};
