import React, { useState } from "react";
import { Popover, Button } from "@mui/material";

export default function ButtonWithPopover({
    buttonProps,
    popoverProps,
    label,
    predicate,
    onClick,
    children,
}) {
    const [anchorEl, setAnchorEl] = useState(null);

    const open = Boolean(anchorEl);
    const id = open ? "simple-popover" : undefined;

    const handleClick = (event) => {
        predicate() ? onClick() : setAnchorEl(event.currentTarget);
    };

    const handleClose = () => {
        setAnchorEl(null);
    };

    return (
        <>
            <Button
                aria-describedby={id}
                onClick={handleClick}
                onMouseLeave={handleClose}
                {...buttonProps}
            >
                {children}
            </Button>
            <Popover
                id={id}
                open={open}
                anchorEl={anchorEl}
                sx={{
                    pointerEvents: "none",
                }}
                anchorOrigin={{
                    vertical: "center",
                    horizontal: "right",
                }}
                transformOrigin={{
                    vertical: "center",
                    horizontal: "left",
                }}
                {...popoverProps}
                disableRestoreFocus
            >
                {label}
            </Popover>
        </>
    );
}
