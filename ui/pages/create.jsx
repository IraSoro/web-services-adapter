import React, {
    useState,
    useEffect
} from "react";
import {
    useNavigate
} from "react-router-dom";
import {
    Button,
    Container,
    Stack,
    Stepper,
    Step,
    StepLabel,
} from "@mui/material";

import {
    AppSelector,
    PageWrapper
} from "../components";
import {
    AppFactory
} from "../factory";


let applet = {
    trigger: {
        app: "",
        name: "",
        args: {}
    },
    action: {
        app: "",
        name: "",
        args: {}
    }
};


const ActionTriggerSelector = (props) => {
    const navigate = useNavigate();
    const [triggers, setTriggers] = useState([]);
    const [actions, setActions] = useState([]);

    useEffect(() => {
        const appName = props.triggerMode
            ? applet.trigger.app
            : applet.action.app;
        fetch(`/api/v1/apps/${appName}`, {
            headers: {
                "Authorization": `${localStorage.getItem("TokenType")} ${localStorage.getItem("AccessToken")}`
            }
        })
            .then((resp) => {
                if (!resp.ok) {
                    throw new Error(resp.status);
                }
                return resp.json();
            })
            .then((app) => props.triggerMode
                ? setTriggers(app.triggers)
                : setActions(app.actions))
            .catch((err) => {
                if (err.message == 401) {
                    navigate("/signIn");
                }
                console.error(err);
            });
    }, []);

    const selectedArr = props.triggerMode
        ? triggers
        : actions;

    const components = selectedArr.map((name) => {
        return (
            <Button
                key={name}
                variant="text"
                onClick={() => props.onSelect(name)}
            >
                {name}
            </Button>
        );
    });

    return (
        <Stack
            direction="column"
            justifyContent="center"
            padding={2}
            spacing={2}
        >
            {components}
        </Stack>
    );
};

const FieldsCompleter = (props) => {
    if (props.triggerMode) {
        return (
            <AppFactory
                app={applet.trigger.app}
                trigger={applet.trigger.name}
                onDone={props.onComplete}
            />
        );
    }
    return (
        <AppFactory
            app={applet.action.app}
            action={applet.action.name}
            onDone={props.onComplete}
        />
    );
};

const CreationFlow = () => {
    const navigate = useNavigate();
    const [activeStep, setActiveStep] = useState(0);

    const steps = [
        // trigger
        {
            name: "Choose trigger app",
            component: (
                <AppSelector
                    triggersOnly
                    onAppClick={(app) => {
                        fetch(`/${app.toLowerCase()}/status`, {
                            method: "POST",
                            headers: {
                                "Authorization": `${localStorage.getItem("TokenType")} ${localStorage.getItem("AccessToken")}`
                            }
                        })
                            .then((resp) => {
                                if (!resp.ok) {
                                    throw new Error(resp.status);
                                }
                                return resp.json();
                            })
                            .then((json) => {
                                if (!json.connected) {
                                    navigate(`/apps/${app}`);
                                } else {
                                    applet.trigger.app = app;
                                    setActiveStep((step) => step + 1);
                                }
                            })
                            .catch((err) => {
                                if (err.message == 404) {
                                    navigate("/NotFound");
                                } else if (err.message == 401) {
                                    navigate("/signIn");
                                }
                                console.error(err);
                            });
                    }}
                />
            )
        },
        {
            name: "Select trigger",
            component: (
                <ActionTriggerSelector
                    triggerMode
                    onSelect={(trigger) => {
                        applet.trigger.name = trigger;
                        setActiveStep((step) => step + 1);
                    }}
                />
            )
        },
        {
            name: "Complete trigger fields",
            component: (
                <FieldsCompleter
                    triggerMode
                    onComplete={(args) => {
                        applet.trigger.args = args;
                        setActiveStep((step) => step + 1);
                    }}
                />
            )
        },
        // action
        {
            name: "Choose action app",
            component: (
                <AppSelector
                    actionsOnly
                    onAppClick={(app) => {
                        fetch(`/${app.toLowerCase()}/status`, {
                            method: "POST",
                            headers: {
                                "Authorization": `${localStorage.getItem("TokenType")} ${localStorage.getItem("AccessToken")}`
                            }
                        })
                            .then((resp) => {
                                if (!resp.ok) {
                                    throw new Error(resp.status);
                                }
                                return resp.json();
                            })
                            .then((json) => {
                                if (!json.connected) {
                                    navigate(`/apps/${app}`);
                                } else {
                                    applet.action.app = app;
                                    setActiveStep((step) => step + 1);
                                }
                            })
                            .catch((err) => {
                                if (err.message == 404) {
                                    navigate("/NotFound");
                                } else if (err.message == 401) {
                                    navigate("/signIn");
                                }
                                console.error(err);
                            });
                    }}
                />
            )
        },
        {
            name: "Select action",
            component: (
                <ActionTriggerSelector
                    actionMode
                    onSelect={(action) => {
                        applet.action.name = action;
                        setActiveStep((step) => step + 1);
                    }}
                />
            )
        },
        {
            name: "Complete action fields",
            component: (
                <FieldsCompleter
                    actionMode
                    onComplete={(args) => {
                        applet.action.args = args;
                        fetch("/api/v1/applets", {
                            method: "POST",
                            headers: {
                                "Accept": "application/json",
                                "Authorization": `${localStorage.getItem("TokenType")} ${localStorage.getItem("AccessToken")}`,
                                "Content-Type": "application/json"
                            },
                            body: JSON.stringify(applet)
                        })
                            .then((resp) => {
                                if (!resp.ok) {
                                    throw new Error(resp.status);
                                }
                            })
                            .then(() => navigate("/"))
                            .catch((err) => {
                                if (err.message == 401) {
                                    navigate("/signIn");
                                }
                                console.error(err);
                            });
                    }}
                />
            )
        }
    ];

    return (
        <Container>
            <Stepper activeStep={activeStep}>
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
            {steps[activeStep].component}
        </Container>
    );
};

export const Create = () => {
    applet = {
        trigger: {
            app: "",
            name: "",
            args: {}
        },
        action: {
            app: "",
            name: "",
            args: {}
        }
    };

    return (
        <PageWrapper>
            <CreationFlow />
        </PageWrapper>
    );
};
