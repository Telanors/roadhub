import React, { useState, useEffect } from "react";
import AuthenticatedLayout from "@/Layouts/AuthenticatedLayout";
import { Head } from "@inertiajs/react";

import ProfileCard from "@/Components/MIHAComponents/ProfileCard";
import Tabs from "@/Components/MIHAComponents/Tabs";

import { Avatar, Box, Button, Stack, Typography, Divider } from "@mui/material";

import { stringToColor } from "@/utilities";

import PersonIcon from "@mui/icons-material/Person";
import BookmarkIcon from "@mui/icons-material/Bookmark";
import PersonRemoveIcon from "@mui/icons-material/PersonRemove";

export default function Edit({ auth }) {
    const [rating, setRating] = useState(0);
    const [value, setValue] = useState("one");

    const [stacks, setStacks] = useState([
        { username: "telanors" },
        { username: "annihilator" },
    ]);

    const handleUnsubscribe = (index) => {
        const newStacks = stacks.filter((_, i) => i !== index);
        setStacks(newStacks);
    };

    const handleChange = (event, newValue) => {
        setValue(newValue);
    };

    useEffect(() => {
        fetchRating();
    }, [auth.user.id]);

    const fetchRating = async () => {
        try {
            const response = await axios.get(
                route("likes.getUserLikesCountByEntityType", {
                    userId: auth.user.id,
                    entityType: "roadmap",
                })
            );
            const { total_likes, total_dislikes } = response.data;

            const totalReactions = total_likes + total_dislikes;
            const calculatedRating =
                totalReactions > 0 ? (total_likes / totalReactions) * 5 : 0;
            setRating(calculatedRating);
        } catch (error) {
            console.error("Ошибка при загрузке лайков и дизлайков:", error);
        }
    };

    return (
        <AuthenticatedLayout
            user={auth.user}
            header={
                <ProfileCard
                    rating={rating}
                    name={auth.user.name}
                    email={auth.user.email}
                    backgroundUrl="/images/profile_background.jpg"
                />
            }
        >
            <Head title="Профиль" />

            <div className="py-6">
                <div className="max-w-7xl mx-auto space-y-6">
                    <div className="p-8 bg-white shadow rounded-xl">
                        <Box textAlign="left">
                            <Box
                                display="flex"
                                alignItems="center"
                                className="!px-4 !mb-3"
                            >
                                <PersonIcon
                                    className="me-2"
                                    style={{ color: "rgba(0, 0, 0, 0.6)" }}
                                />
                                <Typography
                                    variant="subtitle1"
                                    style={{ color: "rgba(0, 0, 0, 0.6)" }}
                                >
                                    Подписки
                                </Typography>
                            </Box>

                            <Divider className="!mb-4"></Divider>
                            <Stack display="flex" direction="row">
                                {stacks.length === 0 && (
                                    <Typography variant="body1">
                                        Список подписок пуст
                                    </Typography>
                                )}
                                {stacks.map((stack, index) => (
                                    <Stack
                                        key={index}
                                        display="flex"
                                        direction="column"
                                        alignItems="center"
                                        justifyContent="center"
                                        className="border p-3 rounded-3xl text-center mx-4"
                                    >
                                        <Avatar
                                            sx={{
                                                fontSize: "2rem",
                                                width: 96,
                                                height: 96,
                                                bgcolor: stringToColor(
                                                    stack.username
                                                ),
                                            }}
                                        >
                                            {stack.username
                                                .charAt(0)
                                                .toUpperCase()}
                                        </Avatar>
                                        <Typography
                                            variant="h6"
                                            className="!font-normal pb-2"
                                        >
                                            {stack.username}
                                        </Typography>
                                        <Button
                                            variant="contained"
                                            className="!normal-case !rounded-full !bg-blue-500 !shadow-none hover:!bg-blue-600"
                                            onClick={() =>
                                                handleUnsubscribe(index)
                                            }
                                        >
                                            <PersonRemoveIcon className="me-2" />
                                            Отписаться
                                        </Button>
                                    </Stack>
                                ))}
                            </Stack>
                        </Box>
                    </div>
                    <div className="p-8 bg-white shadow rounded-xl">
                        <Tabs user={auth.user}></Tabs>
                    </div>
                </div>
            </div>
        </AuthenticatedLayout>
    );
}
