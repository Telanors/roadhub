import React, { useState, useEffect } from "react";
import axios from "axios";
import {
    Box,
    Button,
    TextField,
    Typography,
    Paper,
    Link,
    FormControl,
    Select,
    MenuItem,
} from "@mui/material";
import OwnerPlane from "@/Components/MIHAComponents/OwnerPlane";
import LikeDislike from "@/Components/MIHAComponents/LikeDislike";

export default function CommentsSection({ user, roadmapId }) {
    const [comments, setComments] = useState([]);
    const [newComment, setNewComment] = useState("");
    const [sortOrder, setSortOrder] = useState("desc");
    const [currentPage, setCurrentPage] = useState(1);
    const [hasMore, setHasMore] = useState(true);
    const [totalComments, setTotalComments] = useState(0);
    const [loadingMore, setLoadingMore] = useState(false);

    useEffect(() => {
        if (!roadmapId) return;

        const fetchComments = async () => {
            try {
                setLoadingMore(true);
                const response = await axios.get(
                    route("comments.get", {
                        roadmapId: roadmapId,
                        sortOrder: sortOrder,
                        page: currentPage,
                    })
                );
                if (currentPage === 1) {
                    setComments(response.data.data);
                } else {
                    setComments((prevComments) => [
                        ...prevComments,
                        ...response.data.data,
                    ]);
                }
                setHasMore(response.data.next_page_url !== null);
                setTotalComments(response.data.total);
            } catch (error) {
                console.error("Ошибка при загрузке комментариев:", error);
            } finally {
                setLoadingMore(false);
            }
        };

        fetchComments();
    }, [roadmapId, sortOrder, currentPage]);

    const handleCommentChange = (event) => {
        setNewComment(event.target.value);
    };

    const handleAddComment = async () => {
        if (!roadmapId || !user) return;
        if (newComment.trim()) {
            try {
                const response = await axios.post(route("comments.post"), {
                    user_id: user.id,
                    roadmap_id: roadmapId,
                    text: newComment,
                });

                setComments([response.data, ...comments]);
                setNewComment("");
                setTotalComments(totalComments + 1);
            } catch (error) {
                console.error("Ошибка при отправке комментария:", error);
            }
        }
    };

    const handleChangeSortOrder = (event) => {
        setSortOrder(event.target.value);
        setCurrentPage(1);
    };

    const handleLoadMore = () => {
        setCurrentPage((prevPage) => prevPage + 1);
    };

    return (
        <>
            <Typography variant="h5" className="!mb-4">
                Комментарии: {totalComments}
            </Typography>
            <Box component="div" className="space-y-4">
                {user && (
                    <TextField
                        disabled={Boolean(!user)}
                        InputProps={{
                            className: "!rounded-xl",
                        }}
                        label="Добавьте комментарий"
                        multiline
                        rows={2}
                        variant="outlined"
                        fullWidth
                        value={newComment}
                        onChange={handleCommentChange}
                    />
                )}
                <Box
                    display="flex"
                    justifyContent="space-between"
                    alignItems="center"
                >
                    {user ? (
                        <Button
                            disabled={Boolean(!user)}
                            className="!normal-case !rounded-full"
                            variant="contained"
                            color="primary"
                            onClick={handleAddComment}
                        >
                            Отправить
                        </Button>
                    ) : (
                        <Typography variant="subtitle1" gutterBottom>
                            <Link href={route("login")} underline="none">
                                Войдите
                            </Link>
                            , чтобы оставлять комментарии
                        </Typography>
                    )}
                    {comments.length > 1 && (
                        <FormControl>
                            <Select
                                value={sortOrder}
                                onChange={handleChangeSortOrder}
                                className="!rounded-xl !text-sm"
                                inputProps={{
                                    className: "!py-2",
                                }}
                            >
                                <MenuItem value="desc">В начале новые</MenuItem>
                                <MenuItem value="asc">В начале старые</MenuItem>
                            </Select>
                        </FormControl>
                    )}
                </Box>
                {comments.map((comment, index) => (
                    <Paper
                        key={index}
                        className="!rounded-xl p-4 !shadow-none !border"
                    >
                        <OwnerPlane name={comment.user.name}>
                            <Typography variant="body2" color="textSecondary">
                                {comment.created_at}
                            </Typography>
                        </OwnerPlane>
                        <Typography variant="body2" className="!ms-14 !my-3">
                            {comment.text}
                        </Typography>
                        <LikeDislike
                            entityId={comment.id}
                            entityType="comment"
                            user={user}
                        />
                    </Paper>
                ))}
                {hasMore && (
                    <Box display="flex" justifyContent="center">
                        <Button
                            className="!rounded-full !normal-case"
                            variant="contained"
                            color="primary"
                            onClick={handleLoadMore}
                            disabled={loadingMore}
                        >
                            Загрузить еще
                        </Button>
                    </Box>
                )}
            </Box>
        </>
    );
}
