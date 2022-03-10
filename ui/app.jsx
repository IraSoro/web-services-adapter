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
    Explore,
    MyApplets
} from "./pages";


const App = () => {
    return (
        <Fragment>
            <Routes>
                <Route path="/" element={<MyApplets />} />
                <Route path="/explore" element={<Explore />} />
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
