import React, {
    Fragment,
    useState,
    useEffect
} from "react";
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
} from "../app-factory";


const newApplet = {
    triggerApp: "",
    trigger: "",
    triggerArgs: {},

    actionApp: "",
    action: "",
    actionArgs: {}
};

const AppTrigger = (props) => {
    return (
        <Button
            variant="text"
            onClick={() => props.onClick(props.name)}
        >
            {props.name}
        </Button>
    );
};

const TriggerSelector = (props) => {
    const [triggers, setTriggers] = useState([]);

    useEffect(() => {
        fetch(`/api/v1/apps/${newApplet.triggerApp}`)
            .then((resp) => resp.json())
            .then((app) => setTriggers(app.triggers))
            .catch((err) => console.error(err));
    }, []);

    const triggersComponents = triggers.map((trigger) => {
        return (
            <AppTrigger
                key={trigger}
                name={trigger}
                onClick={props.onTriggerClick}
            />
        );
    });

    return (
        <Stack
            direction="row"
            justifyContent="center"
            padding={2}
            spacing={2}
        >
            {triggersComponents}
        </Stack>
    );
};

const ActionSelector = (props) => {
    const [actions, setActions] = useState([]);

    useEffect(() => {
        fetch(`/api/v1/apps/${newApplet.actionApp}`)
            .then((resp) => resp.json())
            .then((app) => setActions(app.commands))
            .catch((err) => console.error(err));
    }, []);

    const actionsComponents = actions.map((action) => {
        return (
            <AppTrigger
                key={action}
                name={action}
                onClick={props.onActionClick}
            />
        );
    });

    return (
        <Stack
            direction="row"
            justifyContent="center"
            padding={2}
            spacing={2}
        >
            {actionsComponents}
        </Stack>
    );
};

const FieldsCompleter = (props) => {
    return (
        <AppFactory
            app={newApplet.triggerApp}
            trigger={newApplet.trigger}
            onDone={props.onDone}
        />
    );
};

const FieldsActionCompleter = (props) => {
    return (
        <AppFactory
            app={newApplet.actionApp}
            action={newApplet.action}
            onDone={props.onDone}
        />
    );
}

const CreateFlow = () => {
    const [activeStep, setActiveStep] = useState(0);

    const steps = [
        // trigger
        {
            name: "Choose trigger app",
            component: (
                <AppSelector
                    triggersOnly
                    onAppClick={(appName) => {
                        newApplet.triggerApp = appName;
                        setActiveStep((step) => step + 1);
                    }}
                />
            )
        },
        {
            name: "Select trigger",
            component: (
                <TriggerSelector
                    onTriggerClick={(triggerName) => {
                        newApplet.trigger = triggerName;
                        setActiveStep((step) => step + 1);
                    }}
                />
            )
        },
        {
            name: "Complete trigger fields",
            component: (
                <FieldsCompleter
                    onDone={(args) => {
                        newApplet.triggerArgs = args;
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
                    onAppClick={(appName) => {
                        newApplet.actionApp = appName;
                        console.log(newApplet);
                        setActiveStep((step) => step + 1);
                    }}
                />
            )
        },
        {
            name: "Select action",
            component: (
                <ActionSelector
                    onActionClick={(actionName) => {
                        newApplet.action = actionName;
                        console.log(newApplet);
                        setActiveStep((step) => step + 1);
                    }}
                />
            )
        },
        {
            name: "Complete action fields",
            component: (
                <FieldsActionCompleter
                    onDone={(args) => {
                        newApplet.actionArgs = args;
                        console.log("Done!!!", "Send", newApplet);
                    }}
                />
            )
        }
    ];
    return (
        <Fragment>
            <Stepper activeStep={activeStep}>
                {
                    steps.map((step) => (
                        <Step key={step.name}>
                            <StepLabel>{step.name}</StepLabel>
                        </Step>
                    ))
                }
            </Stepper>
            <Stack justifyContent="center">
                {steps[activeStep].component}
            </Stack>
            <Stack
                direction="row"
                justifyContent="center"
            >
                <Button
                    disabled={activeStep == 0}
                    onClick={() => setActiveStep((step) => step - 1)}
                >
                    Back
                </Button>
                <Button
                    disabled={activeStep >= steps.length - 1}
                    onClick={() => setActiveStep((step) => step + 1)}
                >
                    Next
                </Button>
                <Button
                    variant="contained"
                    disabled={activeStep < steps.length - 1}
                    onClick={() => console.log("Done!!!")}
                >
                    Done
                </Button>
            </Stack>
        </Fragment>

    );
};

export const Create = () => {
    return (
        <PageWrapper>
            <Container>
                <CreateFlow />
            </Container>
        </PageWrapper>
    );
};
