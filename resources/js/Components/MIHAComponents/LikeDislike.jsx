import React, { useState, useEffect } from "react";
import axios from "axios";
import { Button, Box } from "@mui/material";
import ThumbUpIcon from "@mui/icons-material/ThumbUpRounded";
import ThumbDownIcon from "@mui/icons-material/ThumbDownRounded";

export default function LikeDislike({ entityId, entityType, user, onClick }) {
    const [likes, setLikes] = useState(0);
    const [dislikes, setDislikes] = useState(0);
    const [userReaction, setUserReaction] = useState(null);
    const [isUpdating, setIsUpdating] = useState(true);

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

    useEffect(() => {
        const fetchUserReaction = async () => {
            if (!user) return;
            setIsUpdating(true);
            try {
                const response = await axios.get(
                    route("likes.getUserReaction", { entityType, entityId })
                );
                if (response.data.hasOwnProperty("is_like")) {
                    setUserReaction(response.data.is_like);
                } else {
                    setUserReaction(null);
                }
            } catch (error) {
                console.error(
                    "Ошибка при загрузке реакции пользователя:",
                    error
                );
            } finally {
                setIsUpdating(false);
            }
        };

        fetchUserReaction();
    }, [entityType, entityId, user]);

    const handleReaction = async (isLike) => {
        if (!user || isUpdating) return;

        try {
            setIsUpdating(true);

            await axios.post(route("likes.like"), {
                user_id: user.id,
                entity_id: entityId,
                entity_type: entityType,
                is_like: isLike,
            });

            if (isLike) {
                if (userReaction === 1) {
                    setLikes((prev) => prev - 1);
                    setUserReaction(null);
                } else {
                    setLikes((prev) => prev + 1);
                    if (userReaction === 0) {
                        setDislikes((prev) => prev - 1);
                    }
                    setUserReaction(1);
                }
            } else {
                if (userReaction === 0) {
                    setDislikes((prev) => prev - 1);
                    setUserReaction(null);
                } else {
                    setDislikes((prev) => prev + 1);
                    if (userReaction === 1) {
                        setLikes((prev) => prev - 1);
                    }
                    setUserReaction(0);
                }
            }
            onClick && onClick();
        } catch (error) {
            console.error("Ошибка при отправке реакции:", error);
        } finally {
            setIsUpdating(false);
        }
    };

    return (
        <Box display="flex" flexDirection="row" alignItems="center">
            <Button
                color={userReaction === 1 ? "primary" : "secondary"}
                variant="outlined"
                onClick={() => handleReaction(true)}
                className="!normal-case !rounded-full !me-2"
                disabled={isUpdating}
            >
                <ThumbUpIcon className="!me-2" />
                {likes}
            </Button>

            <Button
                color={userReaction === 0 ? "error" : "secondary"}
                variant="outlined"
                onClick={() => handleReaction(false)}
                className="!normal-case !rounded-full !me-2"
                disabled={isUpdating}
            >
                <ThumbDownIcon className="!me-2" />
                {dislikes}
            </Button>
        </Box>
    );
}
