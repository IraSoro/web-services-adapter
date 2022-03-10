import React, {
    useState,
    useEffect
} from "react";
import {
    Stack
} from "@mui/material";

import { ApplicationCard } from "../components";


export const ApplicationsList = (props) => {
    const [apps, setApps] = useState([]);

    useEffect(() => {
        fetch(`/api/v1/apps/${props.filter ?? ""}`)
            .then((resp) => resp.json())
            .then((apps) => {
                setApps(apps.map((app) => {
                    return <ApplicationCard key={app} name={app} />;
                }));
            })
            .catch((err) => console.error(err));
    }, [props.filter]);

    return (
        <Stack direction="row" padding={2} spacing={2}>
            {apps}
        </Stack>
    );
};
