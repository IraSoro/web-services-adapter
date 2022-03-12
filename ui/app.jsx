import React from "react";
import ReactDOM from "react-dom";
import {
    useRoutes,
    BrowserRouter,
} from "react-router-dom";

import {
    AppInfo,
    Create,
    MyApplets,
    Explore,
    NotFound
} from "./pages";


const App = () => {
    /* FIXME @imblowfish: Если в браузере открыть /apps/какое-нибудь-неподдерживаемое-приложение,
     * то пытается загрузить картинку с сервера, нужно проверять, что такое приложение действительно
     * существует, и отображать NotFound, если его нет
     */
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
                    element: <AppInfo />
                }
            ]
        },
        {
            path: "create",
            element: <Create />
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
