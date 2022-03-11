import React from "react";
import ReactDOM from "react-dom";
import {
    useRoutes,
    BrowserRouter,
} from "react-router-dom";

import {
    ApplicationSettings,
    MyApplets,
    Explore,
    NotFound
} from "./pages";


const App = () => {
    const routes = useRoutes([
        {
            path: "/",
            element: <MyApplets />,
        },
        {
            path: "explore",
            element: <Explore />
        },
        {
            path: "apps",
            children: [
                {
                    path: ":appName",
                    element: <ApplicationSettings />
                }
            ]
        },
        {
            path: "*",
            element: <NotFound />
        }
    ]);

    return routes;
};

ReactDOM.render(
    <BrowserRouter>
        <App />
    </BrowserRouter>,
    document.getElementById("root")
);
