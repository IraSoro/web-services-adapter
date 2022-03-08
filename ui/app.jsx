import React, {
    Fragment,
    useState,
    useEffect
} from "react";
import ReactDOM from "react-dom";
import {
    Avatar,
    Box,
    Button,
    Card,
    CardContent,
    Container,
    List,
    Stack,
    TextField,
    Typography
} from "@mui/material";
import SearchIcon from "@mui/icons-material/Search";


const Search = (props) => {
    return (
        <Box sx={{ display: "flex", alignItems: "center" }}>
            <SearchIcon />
            <TextField label="Search..."
                onChange={props.onChange} />
        </Box>
    );
};

const AppIcon = (props) => {
    return (
        <Card variant="outlined">
            <CardContent>
                <Typography sx={{ fontSize: 14 }} color="text.secondary">
                    {props.name}
                </Typography>
                <Avatar variant="square" src={"/api/v1/apps/" + props.name + "/icon"} />
                <Button>
                    Configure
                </Button>
            </CardContent>
        </Card>
    );
};

const AppsList = (props) => {
    const [apps, setApps] = useState([]);

    useEffect(() => {
        fetch(`/api/v1/apps/${props.pattern}`)
            .then((resp) => resp.json())
            .then((apps) => setApps(apps.map((app) => <AppIcon key={app} name={app} />)))
            .catch((err) => console.error(err));
    }, [props.pattern]);

    return (
        <Fragment>
            <Stack direction="row" padding={2} spacing={2}>
                {apps}
            </Stack>
        </Fragment>
    );
};

const ExploreApps = () => {
    const [pattern, setPattern] = useState("");

    return (
        <List>
            <Search onChange={(event) => setPattern(event.target.value)} />
            <AppsList pattern={pattern} />
        </List>
    );
};

const App = () => {
    return (
        <Container>
            <ExploreApps />
        </Container>
    );
};

ReactDOM.render(<App />, document.getElementById("root"));
