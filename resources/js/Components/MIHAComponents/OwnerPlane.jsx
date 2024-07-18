import React from "react";
import { Avatar, Box, Typography } from "@mui/material";
import { stringToColor } from "@/utilities";

export default function OwnerPlane({ name, children, ...props }) {
    const firstLetter = name ?? false;
    return (
        <Box display="flex" alignItems="center" {...props}>
            <Avatar
                alt={name}
                sx={{
                    backgroundColor: stringToColor(name ?? "user"),
                    width: 40,
                    height: 40,
                    mr: 2,
                }}
            >
                {firstLetter && name[0].toUpperCase()}
            </Avatar>
            <Box display="flex" flexDirection="column" alignItems="left">
                <Typography variant="body2">{name}</Typography>
                {children}
            </Box>
        </Box>
    );
}
