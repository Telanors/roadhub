import React, { useState, useEffect } from "react";
import AuthenticatedLayout from "@/Layouts/AuthenticatedLayout";
import CatalogCard from "@/Components/MIHAComponents/CatalogCard";
import CheckboxesTagsInput from "@/Components/MIHAComponents/CheckboxesTagsInput";
import { Head } from "@inertiajs/react";
import "reactflow/dist/style.css";
import {
    Box,
    Button,
    CircularProgress,
    Typography,
    FormControl,
    Select,
    MenuItem,
} from "@mui/material";
import { arraysAreEqual } from "@/utilities";

export default function Catalog({ user, tags }) {
    const [roadmaps, setRoadmaps] = useState([]);
    const [ratings, setRatings] = useState({});

    const [loadingMore, setLoadingMore] = useState(true);
    const [currentPage, setCurrentPage] = useState(1);
    const [currentTags, setCurrentTags] = useState(tags);
    const [hasMore, setHasMore] = useState(true);
    const [sortOrder, setSortOrder] = useState("desc,updated_at");

    useEffect(() => {
        const fetchRating = async (userIds) => {
            try {
                const response = await axios.get(
                    route("likes.getUsersLikesCountByEntityType", {
                        userIds: userIds,
                        entityType: "roadmap",
                    })
                );

                setRatings((prevRatings) => {
                    const newRatings = { ...prevRatings };
                    userIds.forEach((userId) => {
                        const { total_likes, total_dislikes } =
                            response.data[userId];
                        const totalReactions = total_likes + total_dislikes;
                        const calculatedRating =
                            totalReactions > 0
                                ? (total_likes / totalReactions) * 5
                                : 0;
                        newRatings[userId] = calculatedRating;
                    });
                    return newRatings;
                });
            } catch (error) {
                console.error(
                    "Ошибка при загрузке рейтинга произошла ошибка:",
                    error
                );
            }
        };

        const fetchRoadmaps = async () => {
            try {
                setLoadingMore(true);
                const order = sortOrder.split(",");
                const url =
                    order[1] === "likes"
                        ? "roadmap.indexSortedByLikes"
                        : "roadmap.index";
                const response = await axios.get(
                    route(url, {
                        page: currentPage,
                        tags: currentTags,
                        sortOrder: order[0],
                        sortColumn: order[1],
                    })
                );
                var getRoadmaps = [];
                if (currentPage === 1) {
                    getRoadmaps = response.data.data;
                } else {
                    getRoadmaps = [...roadmaps, ...response.data.data];
                }
                let userIds = [
                    ...new Set(getRoadmaps.map((roadmap) => roadmap.user_id)),
                ];
                setRoadmaps(getRoadmaps);
                fetchRating(userIds);
                setHasMore(response.data.next_page_url !== null);
            } catch (error) {
                console.error("Ошибка при загрузке дорожных карт:", error);
                setHasMore(false);
            } finally {
                setLoadingMore(false);
            }
        };

        fetchRoadmaps();
    }, [currentPage, currentTags, sortOrder]);

    const handleLoadMore = () => {
        setCurrentPage((prevPage) => prevPage + 1);
    };

    const handleOnTagChange = (tags) => {
        if (arraysAreEqual(currentTags, tags)) return;
        setCurrentTags(tags);
        setCurrentPage(1);
    };

    const handleChangeSortOrder = (event) => {
        setSortOrder(event.target.value);
        setCurrentPage(1);
    };

    return (
        <>
            <Head title="Каталог" />
            <AuthenticatedLayout
                user={user}
                header={
                    <Box
                        display="flex"
                        justifyContent="space-between"
                        alignItems="center"
                    >
                        <CheckboxesTagsInput
                            onTagsChange={handleOnTagChange}
                            selected={tags}
                            width="85%"
                            className="!me-4"
                        />
                        <FormControl disabled={loadingMore}>
                            <Select
                                value={sortOrder}
                                onChange={handleChangeSortOrder}
                                className="!rounded-xl !text-base !text-gray-500"
                                style={{ height: "40px", width: "167px" }}
                            >
                                <MenuItem value="desc,updated_at">
                                    В начале новые
                                </MenuItem>
                                <MenuItem value="asc,updated_at">
                                    В начале старые
                                </MenuItem>
                                <MenuItem value="desc,views">
                                    По просмотрам
                                </MenuItem>
                                <MenuItem value="desc,likes">
                                    По лайкам
                                </MenuItem>
                            </Select>
                        </FormControl>
                    </Box>
                }
            >
                {console.log(ratings)}
                {roadmaps.length > 0 ? (
                    <div className="px-12 lg:px-32 py-6 grid grid-cols-1 sm:grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 mx-auto">
                        {roadmaps.map((roadmap) => (
                            <CatalogCard
                                key={roadmap.id}
                                entity_id={roadmap.id}
                                user={roadmap.user}
                                entity_type="roadmap"
                                className="w-full"
                                updatedAt={roadmap.updated_at}
                                image={roadmap.preview_path}
                                label={roadmap.name}
                                rating={ratings[roadmap.user_id]}
                                views={roadmap.views}
                                href={route("catalog.show", roadmap.id)}
                            >
                                {roadmap.description}
                            </CatalogCard>
                        ))}
                    </div>
                ) : (
                    !loadingMore && (
                        <Typography
                            component="div"
                            className="text-center !mt-6"
                            variant="h5"
                            color="secondary"
                        >
                            Упс! Ничего не найдено...
                            <div className="text-8xl mt-2">{":("}</div>
                        </Typography>
                    )
                )}

                {loadingMore ? (
                    <Box
                        display="flex"
                        justifyContent="center"
                        alignItems="center"
                        className="!mb-4"
                    >
                        <CircularProgress />
                    </Box>
                ) : (
                    hasMore && (
                        <Box
                            display="flex"
                            justifyContent="center"
                            className="!mb-4"
                        >
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
                    )
                )}
            </AuthenticatedLayout>
        </>
    );
}
