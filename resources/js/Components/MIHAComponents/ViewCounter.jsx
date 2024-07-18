import React from "react";
import VisibilityIcon from "@mui/icons-material/VisibilityRounded";
import { Typography, Box } from "@mui/material";

export default function ViewCounter({ views, ...props }) {
    return (
        <Box
            {...props}
            display="flex"
            alignItems="center"
            justifyContent="center"
        >
            <VisibilityIcon className="text-gray-400 me-2" />
            <Typography className="text-gray-400">{views ?? "0"}</Typography>
        </Box>
    );
}
