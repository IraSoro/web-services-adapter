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
    triggerAppName: "",
    triggerName: "",
    triggerArgs: {},

    actionAppName: "",
    actionName: "",
    actionArgs: {}
};


const ActionTriggerSelector = (props) => {
    const [triggers, setTriggers] = useState([]);
    const [actions, setActions] = useState([]);

    useEffect(() => {
        const appName = props.triggerMode
            ? applet.triggerAppName
            : applet.actionAppName;
        fetch(`/api/v1/apps/${appName}`)
            .then((resp) => resp.json())
            .then((app) => props.triggerMode
                ? setTriggers(app.triggers)
                : setActions(app.commands))
            .catch((err) => console.error(err));
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
                app={applet.triggerAppName}
                trigger={applet.triggerName}
                onDone={props.onComplete}
            />
        );
    }
    return (
        <AppFactory
            app={applet.actionAppName}
            action={applet.actionName}
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
                        applet.triggerAppName = app;
                        setActiveStep((step) => step + 1);
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
                        applet.triggerName = trigger;
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
                        applet.triggerArgs = args;
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
                        applet.actionAppName = app;
                        setActiveStep((step) => step + 1);
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
                        applet.actionName = action;
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
                        applet.actionArgs = args;
                        // TODO @imblowfish: Реализовать отправку на сервер
                        console.log("Send", applet, "to server");
                        navigate("/");
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
    applet = {};

    return (
        <PageWrapper>
            <CreationFlow />
        </PageWrapper>
    );
};
