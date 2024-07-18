import AuthenticatedLayout from "@/Layouts/AuthenticatedLayout";
import { Head } from "@inertiajs/react";
import React, { useEffect, useMemo, useRef, useState } from "react";
import ReactFlow, {
    MiniMap,
    Controls,
    useNodesState,
    useEdgesState,
    Background,
} from "reactflow";

import "reactflow/dist/style.css";

import TopicNode from "@/Nodes/TopicNodeReadOnly";
import SubtopicNode from "@/Nodes/SubtopicNodeReadOnly";
import NameNode from "@/Nodes/NameNode";
import SectionNode from "@/Nodes/SectionNodeReadOnly";
import NodeContentDialog from "@/Components/MIHAComponents/NodeContentDialog";
import CommentsSection from "@/Components/MIHAComponents/CommentsSection";
import Accordion from "@/Components/MIHAComponents/Accordion";
import OwnerPlane from "@/Components/MIHAComponents/OwnerPlane";
import LikeDislike from "@/Components/MIHAComponents/LikeDislike";
import UserRating from "@/Components/MIHAComponents/UserRating";
import ViewCounter from "@/Components/MIHAComponents/ViewCounter";

import {
    Box,
    Button,
    Typography,
    IconButton,
    Chip,
} from "@mui/material";
import {
    PersonAddAlt1 as PersonAddAltRoundedIcon,
    PersonRemove as PersonRemoveIcon,
    ShareOutlined as ShareRoundedIcon,
    FileDownloadRounded as FileDownloadRoundedIcon,
    CodeRounded as CodeRoundedIcon,
    MoreVertRounded as MoreVertRoundedIcon,
    TagRounded as TagIcon,
    BookmarkAdd as BookmarkIcon,
    BookmarkRemove as BookmarkRemoveIcon,
    AddCircle as AddIcon,
    RemoveCircle as RemoveIcon,
} from "@mui/icons-material";

export default function Detail({ user, roadmap }) {
    const reactFlowWrapper = useRef(null);
    const [selectedNode, setSelectedNode] = useState(null);
    const [nodes, setNodes, onNodesChange] = useNodesState([]);
    const [edges, setEdges, onEdgesChange] = useEdgesState([]);
    const [openContent, setOpenContent] = useState(false);
    const [tags, setTags] = useState([]);
    const [rating, setRating] = useState(0);
    const [isBookmarked, setIsBookmarked] = useState(false);
    const [isSubscribe, setIsSubscribe] = useState(false);

    const handleOpenContent = () => setOpenContent(true);
    const handleCloseContent = () => setOpenContent(false);

    const nodeTypes = useMemo(
        () => ({
            topicNode: TopicNode,
            subtopicNode: SubtopicNode,
            nameNode: NameNode,
            sectionNode: SectionNode,
        }),
        []
    );

    const handleButtonClick = (event) => {
        setIsBookmarked(!isBookmarked);
    };

    const handleSubButtonClick = (event) => {
        setIsSubscribe(!isSubscribe);
    };

    const handleFileUpload = async (filePath) => {
        try {
            const response = await fetch(filePath);
            if (!response.ok) {
                throw new Error(`Ошибка запроса файла: ${response.statusText}`);
            }

            const flow = await response.json();
            if (flow) {
                setNodes(flow.nodes || []);
                setEdges(flow.edges || []);
            }
        } catch (error) {
            console.error("Ошибка чтения JSON файла:", error);
        }
    };

    const handleTagsUpload = async (roadmapId) => {
        try {
            const response = await fetch(
                route("roadmap.getTags", { roadmapId: roadmapId })
            );
            if (!response.ok) {
                throw new Error("Ошибка при загрузке тегов");
            }
            const data = await response.json();
            setTags(data);
        } catch (error) {
            console.error("Ошибка загрузки тегов:", error);
        }
    };

    const onNodeClick = (event, node) => {
        if (node?.type !== "topicNode" && node?.type !== "subtopicNode") return;
        handleOpenContent();
        setSelectedNode(node);
    };

    useEffect(() => {
        roadmap.file_path && handleFileUpload(roadmap.file_path);
    }, [roadmap.file_path]);

    useEffect(() => {
        roadmap.id && handleTagsUpload(roadmap.id);
    }, [roadmap.id]);

    useEffect(() => {
        roadmap.user_id && fetchRating(roadmap.user_id);
    }, [roadmap.user_id]);

    const fetchRating = async (id) => {
        try {
            const response = await axios.get(
                route("likes.getUserLikesCountByEntityType", {
                    userId: id,
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
        <>
            <Head title="Roadmap" />
            <NodeContentDialog
                open={openContent}
                onClose={handleCloseContent}
                node={selectedNode}
            />
            <AuthenticatedLayout
                user={user}
                header={
                    <Box
                        display="flex"
                        alignItems="center"
                        justifyContent="space-between"
                    >
                        <Box display="flex" alignItems="center">
                            <OwnerPlane name={roadmap.user.name}>
                                <UserRating value={rating} />
                            </OwnerPlane>
                            {isSubscribe ? (
                                <Button
                                    disabled={Boolean(!user)}
                                    onClick={handleSubButtonClick}
                                    variant="contained"
                                    className="!normal-case !ms-3 !rounded-full !bg-gray-500 !shadow-none hover:!bg-blue-600 disabled:!bg-gray-100"
                                >
                                    <PersonRemoveIcon
                                        color="inherit"
                                        className="!me-2"
                                    />
                                    Отписаться
                                </Button>
                            ) : (
                                <Button
                                    disabled={Boolean(!user)}
                                    onClick={handleSubButtonClick}
                                    variant="contained"
                                    className="!normal-case !ms-3 !rounded-full !bg-blue-500 !shadow-none hover:!bg-blue-600 disabled:!bg-gray-100"
                                >
                                    <PersonAddAltRoundedIcon
                                        color="inherit"
                                        className="!me-2"
                                    />
                                    Подписаться
                                </Button>
                            )}
                        </Box>
                        <Box display="flex">
                            <Button
                                variant="outlined"
                                className="!normal-case !ms-3 !rounded-full !shadow-none hover:!bg-blue-50"
                            >
                                <ShareRoundedIcon
                                    color="inherit"
                                    className="!me-2"
                                />
                                Поделиться
                            </Button>
                            <Button
                                variant="outlined"
                                className="!normal-case !ms-3 !rounded-full  !shadow-none hover:!bg-blue-50"
                            >
                                <FileDownloadRoundedIcon
                                    color="inherit"
                                    className="!me-2"
                                />
                                Скачать
                            </Button>
                            <Button
                                variant="outlined"
                                className="!normal-case !ms-3 !rounded-full  !shadow-none hover:!bg-blue-50"
                            >
                                <CodeRoundedIcon
                                    color="inherit"
                                    className="!me-2"
                                />
                                Исходный код
                            </Button>
                            <IconButton className="!ms-2">
                                <MoreVertRoundedIcon color="inherit" />
                            </IconButton>
                        </Box>
                    </Box>
                }
            >
                <div className="py-6">
                    <div className="max-w-7xl mx-auto space-y-6">
                        <div className="bg-white shadow-md  rounded-xl">
                            <Box
                                display="flex"
                                alignItems="center"
                                justifyContent="space-between"
                                className="!px-6 !py-4"
                            >
                                <Box
                                    display="flex"
                                    alignItems="center"
                                    className="!w-3/6"
                                >
                                    <Typography variant="h5" noWrap>
                                        {roadmap.name}
                                    </Typography>

                                    {isBookmarked ? (
                                        <Button
                                            disabled={Boolean(!user)}
                                            onClick={handleButtonClick}
                                            variant="contained"
                                            className="!normal-case !ms-3 !rounded-full !bg-gray-500 !shadow-none hover:!bg-blue-600 disabled:!bg-gray-100"
                                        >
                                            <BookmarkRemoveIcon
                                                color="inherit"
                                                className="!me-2"
                                            />
                                            Из избранного
                                        </Button>
                                    ) : (
                                        <Button
                                            disabled={Boolean(!user)}
                                            onClick={handleButtonClick}
                                            variant="contained"
                                            className="!normal-case !ms-3 !rounded-full !bg-blue-500 !shadow-none hover:!bg-blue-600 disabled:!bg-gray-100"
                                        >
                                            <BookmarkIcon
                                                color="inherit"
                                                className="!me-2"
                                            />
                                            В избранное
                                        </Button>
                                    )}
                                </Box>
                                <Box
                                    display="flex"
                                    alignItems="center"
                                    justifyContent="center"
                                >
                                    <ViewCounter
                                        views={roadmap.views}
                                        className="!me-4"
                                    />
                                    <LikeDislike
                                        onClick={() =>
                                            fetchRating(roadmap.user_id)
                                        }
                                        entityId={roadmap.id}
                                        entityType="roadmap"
                                        user={user}
                                    />
                                </Box>
                            </Box>
                            <div style={{ height: "725px" }}>
                                <ReactFlow
                                    nodes={nodes}
                                    edges={edges}
                                    onNodesChange={onNodesChange}
                                    onEdgesChange={onEdgesChange}
                                    nodeTypes={nodeTypes}
                                    elementsSelectable={false}
                                    nodesConnectable={false}
                                    nodesDraggable={false}
                                    onNodeClick={onNodeClick}
                                    ref={reactFlowWrapper}
                                    fitView={true}
                                    className="border"
                                >
                                    <MiniMap className="border-0 outline outline-1 outline-gray-300 rounded-xl" />
                                    <Controls
                                        showInteractive={false}
                                        className="border-0 outline outline-1 outline-gray-300 rounded-xl"
                                    />
                                    <Background variant="lines" gap={10} />
                                </ReactFlow>
                            </div>
                            <Accordion
                                label="Информация"
                                className="!px-6 !py-4 !rounded-xl"
                                detailProps={{ className: "!pt-4" }}
                                summaryProps={{
                                    className: "!text-2xl",
                                }}
                                footer={tags.map((tag) => (
                                    <Chip
                                        style={{
                                            color: "#616161",
                                        }}
                                        onClick={() =>
                                            (window.location.href = route(
                                                "catalog",
                                                { tags: tag.id }
                                            ))
                                        }
                                        avatar={<TagIcon />}
                                        label={tag.name}
                                        key={tag.id}
                                    ></Chip>
                                ))}
                            >
                                {roadmap.description}
                            </Accordion>
                        </div>

                        <div className="!px-6 !py-4 bg-white shadow-md rounded-xl">
                            <CommentsSection
                                user={user}
                                roadmapId={roadmap.id}
                            />
                        </div>
                    </div>
                </div>
            </AuthenticatedLayout>
        </>
    );
}
