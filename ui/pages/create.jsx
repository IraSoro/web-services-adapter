import React, {
    useState,
    useEffect,
    useReducer
} from "react";
import {
    Avatar,
    Box,
    Button,
    Card,
    CardContent,
    Divider,
    Stack,
    Container,
    Typography,
    Stepper,
    Step,
    StepLabel
} from "@mui/material";

import {
    PageWrapper,
    Search
} from "../components";


const request = {
    triggerApp: "",
    trigger: "",
    actionApp: "",
    action: ""
};

const ApplicationCard = (props) => {
    const style = {
        display: "flex",
        justifyContent: "center",
        alignItems: "center"
    };
    return (
        <Card variant="outlined"
            onClick={() => props.onClick()}
            sx={{
                ...style,
                width: "150px",
                height: "150px",
                cursor: "pointer"
            }}
        >
            <CardContent>
                <Box sx={style}>
                    <Avatar variant="square" src={"/api/v1/apps/" + props.name + "/icon"} />
                </Box>
                <Box sx={style}>
                    <Typography sx={{ fontSize: 14 }} color="text.secondary">
                        {props.name}
                    </Typography>
                </Box>
            </CardContent>
        </Card>
    );
};

const ChooseTriggerApplication = () => {
    const [apps, setApps] = useState([]);
    const [filter, setFilter] = useState("");

    useEffect(() => {
        fetch(`/api/v1/apps/${filter ?? ""}`)
            .then((resp) => resp.json())
            .then((apps) => {
                setApps(apps.map((app) => {
                    return <ApplicationCard key={app.name} name={app.name} onClick={() => request.triggerApp = app.name} />;
                }));
            })
            .catch((err) => console.error(err));
    }, [filter]);

    return (
        <Stack direction="row" padding={2} spacing={2}>
            <Search onChange={(searchRequest) => setFilter(searchRequest)} />
            {apps}
        </Stack>
    );
};

const ChooseTrigger = () => {
    const [triggers, setTriggers] = useState([]);

    useEffect(() => {
        fetch("/api/v1/apps/" + request.triggerApp)
            .then((resp) => resp.json())
            .then((apps) => setTriggers(apps[0].triggers))
            .catch((err) => console.error(err));
    }, []);

    return (
        <Stack direction="row" padding={2} spacing={2}>
            {triggers.map((trigger) => {
                return <h1 key={trigger} onClick={() => request.trigger = trigger}>{trigger}</h1>;
            })}
        </Stack>
    );
};

const TriggerConfiguration = () => {
    const steps = [
        {
            name: "Choose application",
            element: <ChooseTriggerApplication />
        },
        {
            name: "Choose trigger",
            element: <ChooseTrigger />
        },
        {
            name: "Configure",
            element: <ChooseTriggerApplication />
        }
    ];

    const [configureMode, setConfigureMode] = useState(false);
    const [activeStep, setActiveStep] = useState(0);

    const style = {
        mx: "auto",
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        width: "300px"
    };

    if (!configureMode) {
        return (
            <Card variant="outlined" sx={{ padding: 2 }}>
                <Box sx={style}>
                    <Typography variant="h4">If This</Typography>
                </Box>
                <Box sx={style}>
                    <Button variant="contained"
                        onClick={() => setConfigureMode(true)}
                    >
                        Add
                    </Button>
                </Box>
            </Card>
        );
    } else {
        return (
            <Card variant="outlined" sx={{
                padding: 2,
                cursor: "pointer"
            }}>
                <Stepper activeStep={activeStep} alternativeLabel>
                    {
                        steps.map((step) => {
                            return (
                                <Step key={step.name}>
                                    <StepLabel>{step.name}</StepLabel>
                                </Step>
                            );
                        })
                    }
                </Stepper>

                {steps[activeStep < steps.length ? activeStep : activeStep - 1].element}

                <Box sx={{
                    display: "flex",
                    flexDirection: "row",
                    pt: 2,
                    justifyContent: "space-between"
                }}>
                    <Button
                        onClick={() => setActiveStep((step) => step > 0 ? step - 1 : step)}>
                        Back
                    </Button>
                    <Button
                        onClick={() => setActiveStep((step) => step < steps.length ? step + 1 : step)}>
                        { activeStep == steps.length - 1 ? "Done" : "Next" }
                    </Button>
                </Box>
            </Card>
        );
    }
};

export const Create = () => {
    useEffect(() => {
        console.log("//TODO @imblowfish: Check now edited applet");
    }, []);

    const style = {
        mx: "auto",
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        width: "300px"
    };

    return (
        <PageWrapper>
            <Container>
                <Stack spacing={2} sx={style}>
                    <TriggerConfiguration />
                    {/* <ActionConfiguration /> */}
                </Stack>
            </Container>
        </PageWrapper>
    );
};
