import React from "react";
import {
    useNavigate
} from "react-router-dom";
import {
    AppSelector,
    PageWrapper
} from "../components";


export const Explore = () => {
    const navigate = useNavigate();

    return (
        <PageWrapper>
            <AppSelector
                onAppClick={(selectedApp) => navigate(`/apps/${selectedApp}`)} />
        </PageWrapper>
    );
};
