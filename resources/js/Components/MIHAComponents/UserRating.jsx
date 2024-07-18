import React, { useState, useEffect } from "react";
import axios from "axios";
import { Box, Typography, Rating } from "@mui/material";
import StarRoundedIcon from "@mui/icons-material/FavoriteRounded";

import PropTypes from "prop-types";
import { styled } from "@mui/material/styles";

export default function UserRoadmapRating({ value }) {
    const rating = value ?? 0;
    
    const getColorForRating = () => {
        if (rating >= 4) {
            return "info";
        } else if (rating >= 3) {
            return "warning";
        } else {
            return "error";
        }
    };

    return (
        <Box display="flex" flexDirection="row" alignItems="center">
            <Rating
                className="!me-2"
                size="small"
                name="user-roadmap-rating"
                value={rating}
                precision={0.1}
                readOnly
                icon={
                    <StarRoundedIcon
                        fontSize="inherit"
                        color={getColorForRating()}
                    />
                }
                emptyIcon={
                    <StarRoundedIcon fontSize="inherit" color="disabled" />
                }
            />
            <Typography variant="body2">{rating.toFixed(1)}</Typography>
        </Box>
    );
}
