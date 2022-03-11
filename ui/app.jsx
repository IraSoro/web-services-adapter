import React, {
    Fragment
} from "react";
import ReactDOM from "react-dom";
import {
    BrowserRouter,
    Routes,
    Route
} from "react-router-dom";

import {
    ApplicationSettings,
    MyApplets,
    Explore
} from "./pages";


const App = () => {
    return (
        <Fragment>
            <Routes>
                <Route path="/" element={<MyApplets />} />
                <Route path="/explore" element={<Explore />} />
                <Route path="/apps/:appName" element={<ApplicationSettings />} />
            </Routes>
        </Fragment>
    );
};

ReactDOM.render(
    <BrowserRouter>
        <App />
    </BrowserRouter>,
    document.getElementById("root")
);
