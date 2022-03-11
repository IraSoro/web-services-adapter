import React from "react";
import {
    Box,
    TextField
} from "@mui/material";
import SearchIcon from "@mui/icons-material/Search";


export const Search = (props) => {
    return (
        <Box sx={{
            mx: "auto",
            padding: 2,
            display: "flex",
            alignItems: "center"
        }}>
            <SearchIcon fontSize="large" />
            <TextField label="Search..." onChange={
                (event) => {
                    props.onChange(event.target.value);
                }
            }
            />
        </Box>
    );
};
