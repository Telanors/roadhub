import React, { useState, useEffect } from "react";
import axios from "axios";
import { Typography, Box, Divider } from "@mui/material";
import ThumbUpIcon from "@mui/icons-material/ThumbUpRounded";
import ThumbDownIcon from "@mui/icons-material/ThumbDownRounded";

export default function LikesDislikesDisplay({ entityId, entityType }) {
    const [likes, setLikes] = useState(0);
    const [dislikes, setDislikes] = useState(0);

    useEffect(() => {
        const fetchLikes = async () => {
            try {
                const response = await axios.get(
                    route("likes.getLikes", { entityType, entityId })
                );
                setLikes(response.data.likes);
                setDislikes(response.data.dislikes);
            } catch (error) {
                console.error("Ошибка при загрузке лайков и дизлайков:", error);
            }
        };

        fetchLikes();
    }, [entityType, entityId]);

    return (
        <Box display="flex" alignItems="center">
            <Box
                display="flex"
                className="!me-4 !rounded-full text-blue-600"
            >
                <ThumbUpIcon className="!me-2" />
                <Typography>{likes}</Typography>
            </Box>
            <Box display="flex" className="!rounded-full text-red-600">
                <ThumbDownIcon className="!me-2" />
                <Typography>{dislikes}</Typography>
            </Box>
        </Box>
    );
}
