import React, {
    useState,
    useEffect
} from "react";
import {
    Container,
    Paper,
    Stack,
    Switch,
    IconButton,
    Typography
} from "@mui/material";
import DeleteIcon from "@mui/icons-material/Delete";

import { PageWrapper } from "../components";


// TODO @imblowfish: Удалить MOCK-объект
const mockApplets = [
    { id: "01", active: true, name: "On ReceiveMessage in Telegram SendMessage in Telegram" },
    { id: "02", active: false, name: "On ReceiveMessage in Telegram SendMessage in Telegram" },
    { id: "03", active: true, name: "On ReceiveMessage in Telegram SendMessage in Telegram" }
];

const AppletCard = (props) => {
    const [applet, setApplet] = useState({});

    useEffect(() => {
        // TODO @imblowfish: Обращение к API для получение информации об апплете
        for (const mockApplet of mockApplets) {
            if (mockApplet.id == props.id) {
                setApplet(mockApplet);
                return;
            }
        }
    }, []);

    console.log("Active", applet.active);

    return (
        <Paper
            sx={{
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                justifyContent: "center",
                width: "150px",
                height: "150px",
                cursor: "pointer"
            }}
            variant="outlined"
        >
            <Typography
                variant="body2"
                color="text.secondary"
            >
                {applet.name}
            </Typography>
            <Stack
                direction="row"
                justifyContent="space-between"
            >
                <Switch
                    color="primary"
                    checked={Boolean(applet.active)}
                    onChange={(event) => console.log("// TODO @imblowfish: Change active to", setApplet({
                        ...applet,
                        active: event.target.checked
                    }))}
                />
                <IconButton
                    onClick={() => console.log("// TODO @imblowfish: Delete applet")}
                >
                    <DeleteIcon />
                </IconButton>
            </Stack>

        </Paper >
    );
};

const AppletsList = () => {
    const [applets, setApplets] = useState([]);

    useEffect(() => {
        // TODO @imblowfish: Обращение к API для получения списка апплетов
        setApplets(mockApplets);
    }, []);

    const appletCards = applets.map((applet) => {
        return (
            <AppletCard
                key={applet.id}
                id={applet.id}
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
            {appletCards}
        </Stack>
    );
};

export const MyApplets = () => {
    return (
        <PageWrapper>
            <Container>
                <AppletsList />
            </Container>
        </PageWrapper>
    );
};
