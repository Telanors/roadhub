//Пожалуйста, не смотрите сюда, я очень спешил :(
import React, {
    useState,
    useRef,
    useCallback,
    useMemo,
    useEffect,
} from "react";
import ReactFlow, {
    MiniMap,
    Controls,
    Background,
    ReactFlowProvider,
    useNodesState,
    useEdgesState,
    addEdge,
    useReactFlow,
    applyNodeChanges,
    applyEdgeChanges,
    getRectOfNodes,
    getTransformForBounds,
} from "reactflow";
import {
    Drawer,
    Divider,
    List,
    ListItem,
    ListItemText,
    ListItemIcon,
    Box,
    IconButton,
    Stack,
    Button,
    Snackbar,
    Dialog,
    DialogTitle,
    DialogContent,
    DialogActions,
    TextField,
    Grid,
} from "@mui/material";

import TopicNode from "@/Nodes/TopicNode";
import SubtopicNode from "@/Nodes/SubtopicNode";
import NameNode from "@/Nodes/NameNode";
import SectionNode from "@/Nodes/SectionNode";

import AuthenticatedLayout from "@/Layouts/AuthenticatedLayout";
import { Head, useForm } from "@inertiajs/react";
import TextInput from "@/Components/TextInput";
import InputLabel from "@/Components/InputLabel";
import MouseOverPopover from "@/Components/MouseOverPopover";
import ButtonWithPopover from "@/Components/MIHAComponents/ButtonWithPopover";

import "reactflow/dist/style.css";
import sanitizeHtml from "sanitize-html";
import { toPng } from "html-to-image";

import {
    BackupRounded as BackupIcon,
    ArticleRounded as ArticleIcon,
    QuestionMarkRounded as QuestionIcon,
    ClearRounded as ClearIcon,
    GridViewRounded as SquareIcon,
    SettingsRounded as SettingsIcon,
    UploadFileRounded as InsertDriveFileIcon,
    BookmarkRounded as BookmarkIcon,
    BookmarksRounded as BookmarksIcon,
    FontDownloadRounded as FontDownloadIcon,
    ViewCarouselRounded as ViewCarouselIcon,
    DeleteRounded as DeleteRoundedIcon,
    KeyboardDoubleArrowDownRounded as KeyboardDoubleArrowDownIcon,
    KeyboardArrowDownRounded as KeyboardArrowDownIcon,
    KeyboardArrowUpRounded as KeyboardArrowUpIcon,
    KeyboardDoubleArrowUpRounded as KeyboardDoubleArrowUpIcon,
    FileDownloadRounded as FileDownloadIcon,
    FileUploadRounded as FileUploadIcon,
    ErrorRounded as ErrorIcon,
} from "@mui/icons-material";

const getNodeId = () => `randomnode_${+new Date()}`;
const drawerWidth = 225;
const snapGrid = [10, 10];
const minZoom = 0.5;
const maxZoom = 2;
const imageWidth = 1024;
const imageHeight = 768;

const edgeOptions = {
    type: "smoothstep",
    markerEnd: {
        type: "arrow",
        width: 20,
        height: 20,
        color: "rgb(120 113 108)",
    },
    style: {
        strokeWidth: 2,
        stroke: "rgb(120 113 108)",
    },
};

const ConnectionLine = ({ fromX, fromY, toX, toY }) => {
    return (
        <g>
            <path
                fill="none"
                stroke="rgb(120 113 108)"
                strokeWidth={2}
                className="animated"
                d={`M${fromX},${fromY} C ${fromX} ${toY} ${fromX} ${toY} ${toX},${toY}`}
            />
            <circle
                cx={toX}
                cy={toY}
                fill="#fff"
                r={3}
                stroke="rgb(120 113 108)"
                strokeWidth={2}
            />
        </g>
    );
};

const Canvas = () => {
    const reactFlowWrapper = useRef(null);

    const [nodes, setNodes] = useNodesState([]);
    const [edges, setEdges] = useEdgesState([]);
    const { setViewport, getNodes } = useReactFlow();

    const { data, setData, post, processing, errors } = useForm({
        name: "",
        description: "",
        json: "",
        preview: "",
        tags: "",
    });

    const [selectedNodeLabel, setSelectedNodeLabel] = useState("");
    const [selectedNode, setSelectedNode] = useState(null);
    const [selectedEdge, setSelectedEdge] = useState(null);
    const [rfInstance, setRfInstance] = useState(null);
    const [inputContent, setInputContent] = useState("");
    const [resultContent, setResultContent] = useState("");
    const [isFlowEmpty, setIsFlowEmpty] = useState(true);

    const [openPublish, setOpenPublish] = useState(false);
    const handleOpen = () => setOpenPublish(true);
    const handleClosePublish = () => {
        setOpenPublish(false);
        Object.keys(errors).forEach((key) => {
            errors[key] = "";
        });
    };

    const [openContent, setOpenContent] = useState(false);
    const handleOpenContent = () => {
        setInputContent(selectedNode?.data.content);
        setResultContent(selectedNode?.data.content);
        setOpenContent(true);
    };
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

    const onDragOver = useCallback((event) => {
        event.preventDefault();
        event.dataTransfer.dropEffect = "move";
    }, []);

    const onDrop = useCallback(
        (event) => {
            event.preventDefault();

            const type = event.dataTransfer.getData("application/reactflow");

            if (typeof type === "undefined" || !type) {
                return;
            }

            const position = rfInstance.screenToFlowPosition({
                x: event.clientX,
                y: event.clientY,
            });

            const maxZIndex = Math.max(
                ...nodes.map((node) => node.style.zIndex)
            );
            const zIndex =
                maxZIndex > Number.NEGATIVE_INFINITY ? maxZIndex + 1 : 1;

            const newNode = {
                id: getNodeId(),
                type,
                position,
                data: { label: `${type.toLowerCase()}`, content: "" },
                style: { zIndex: zIndex },
            };

            if (type === "sectionNode") {
                newNode.className =
                    "w-40 h-40 rounded-lg border border-2 border-violet-500 shadow-md bg-gradient-to-r from-blue-100 to-violet-100";
                newNode.data.label = "";
                newNode.style.zIndex = 0;
            }
            setNodes((nds) => nds.concat(newNode));
        },
        [rfInstance, nodes]
    );

    const onConnect = useCallback(
        (params) =>
            setEdges((eds) => addEdge({ ...params, ...edgeOptions }, eds)),
        [setEdges]
    );

    const onSave = useCallback(() => {
        if (rfInstance) {
            const flow = rfInstance.toObject();
            const json = JSON.stringify(flow, null, 2);
            const blob = new Blob([json], {
                type: "application/json;charset=utf-8",
            });
            const url = URL.createObjectURL(blob);
            const a = document.createElement("a");
            a.href = url;
            a.download = "flow.json";
            document.body.appendChild(a);
            a.click();
            document.body.removeChild(a);
            URL.revokeObjectURL(url);
        }
    }, [rfInstance]);

    const onSubmit = async (e) => {
        e.preventDefault();

        try {
            const nodes = getNodes();
            if (!nodes || nodes.length === 0) {
                throw new Error("Нет узлов, доступных для обработки.");
            }

            const nodesBounds = getRectOfNodes(nodes);
            const transform = getTransformForBounds(
                nodesBounds,
                imageWidth,
                imageHeight,
                minZoom,
                maxZoom
            );

            const viewport = document.querySelector(".react-flow__viewport");
            if (!viewport) {
                throw new Error("Элемент viewport не найден.");
            }

            const dataUrl = await toPng(viewport, {
                backgroundColor: "transparent",
                width: imageWidth,
                height: imageHeight,
                style: {
                    width: imageWidth,
                    height: imageHeight,
                    transform: `translate(${transform[0]}px, ${transform[1]}px) scale(${transform[2]})`,
                },
            });

            const flow = rfInstance.toObject();
            const json = JSON.stringify(flow, null, 2);
            data.json = json;
            data.preview = dataUrl;

            post(route("roadmap.store"), {
                onSuccess: () => {
                    handleClosePublish();
                },
                onError: (error) => {
                    console.error("Ошибка при учете данных:", error);
                },
            });
        } catch (error) {
            console.error("Ошибка при отправке:", error);
        }
    };

    const onPublish = useCallback(() => {
        const updatedNodes = nodes.map((node) => {
            return {
                ...node,
                selected: false,
            };
        });

        const updatedEdges = edges.map((edge) => {
            return {
                ...edge,
                selected: false,
            };
        });

        setNodes(updatedNodes);
        setEdges(updatedEdges);
    }, [nodes, edges, setNodes, setEdges]);

    const handleFileUpload = useCallback(
        (event) => {
            const file = event.target.files[0];
            const reader = new FileReader();
            reader.onload = (event) => {
                const flow = JSON.parse(event.target.result);
                if (flow) {
                    const { x = 0, y = 0, zoom = 1 } = flow.viewport;
                    setNodes(flow.nodes || []);
                    setEdges(flow.edges || []);
                    setViewport({ x, y, zoom });
                }
            };
            reader.readAsText(file);
        },
        [setNodes, setEdges, setViewport]
    );

    const onNodesChange = useCallback(
        (changes) => {
            setNodes((nds) => {
                const typeSelect = changes.filter(
                    (change) => change.type === "select"
                );

                if (typeSelect.length > 0) {
                    const selected = typeSelect.find(
                        (change) => change.selected
                    );
                    if (selected !== undefined) {
                        const selectNode = nds.find(
                            (nd) => nd.id === selected.id
                        );
                        setSelectedNodeLabel(selectNode.data.label);
                        setSelectedNode(selectNode);
                    } else {
                        setSelectedNodeLabel("");
                        setSelectedNode(null);
                    }
                }
                return applyNodeChanges(changes, nds);
            });
        },
        [setSelectedNodeLabel, setSelectedNode]
    );

    const onEdgesChange = useCallback(
        (changes) => {
            setEdges((eds) => {
                const typeSelect = changes.filter(
                    (change) => change.type === "select"
                );

                if (typeSelect.length > 0) {
                    const selected = typeSelect.find(
                        (change) => change.selected
                    );
                    if (selected !== undefined) {
                        const selectEdge = eds.find(
                            (ed) => ed.id === selected.id
                        );
                        setSelectedEdge(selectEdge);
                    } else {
                        setSelectedEdge(null);
                    }
                }
                return applyEdgeChanges(changes, eds);
            });
        },
        [setSelectedEdge]
    );

    const onDragStart = (event, nodeType) => {
        event.dataTransfer.setData("application/reactflow", nodeType);
        event.dataTransfer.effectAllowed = "move";
    };

    const onDeleteNode = useCallback(() => {
        if (selectedNode) {
            setNodes((nds) =>
                nds.filter((node) => node.id !== selectedNode.id)
            );
            setEdges((eds) =>
                eds.filter(
                    (edge) =>
                        edge.source !== selectedNode.id &&
                        edge.target !== selectedNode.id
                )
            );
            setSelectedNode(null);
            setSelectedNodeLabel("");
        } else if (selectedEdge) {
            setEdges((eds) =>
                eds.filter((edge) => edge.id !== selectedEdge.id)
            );
            setSelectedEdge(null);
        }
    }, [
        selectedNode,
        selectedEdge,
        setSelectedNode,
        setSelectedEdge,
        setSelectedNodeLabel,
        setNodes,
        setEdges,
    ]);

    const decreaseZIndex = useCallback(() => {
        if (selectedNode) {
            const updatedNodes = nodes.map((node) => {
                if (node.id === selectedNode.id) {
                    return {
                        ...node,
                        style: { ...node.style, zIndex: node.style.zIndex - 1 },
                    };
                }
                return node;
            });
            setNodes(updatedNodes);
        }
    }, [nodes, selectedNode, setNodes]);

    const increaseZIndex = useCallback(() => {
        if (selectedNode) {
            const updatedNodes = nodes.map((node) => {
                if (node.id === selectedNode.id) {
                    return {
                        ...node,
                        style: { ...node.style, zIndex: node.style.zIndex + 1 },
                    };
                }
                return node;
            });
            setNodes(updatedNodes);
        }
    }, [nodes, selectedNode, setNodes]);

    const setZIndexToLowest = useCallback(() => {
        if (selectedNode) {
            const minZIndex = Math.min(
                ...nodes.map((node) => node.style.zIndex)
            );
            const updatedNodes = nodes.map((node) => {
                if (node.id === selectedNode.id) {
                    return {
                        ...node,
                        style: { ...node.style, zIndex: minZIndex - 1 },
                    };
                }
                return node;
            });
            setNodes(updatedNodes);
        }
    }, [nodes, selectedNode, setNodes]);

    const setZIndexToHighest = useCallback(() => {
        if (selectedNode) {
            const maxZIndex = Math.max(
                ...nodes.map((node) => node.style.zIndex)
            );
            const updatedNodes = nodes.map((node) => {
                if (node.id === selectedNode.id) {
                    return {
                        ...node,
                        style: { ...node.style, zIndex: maxZIndex + 1 },
                    };
                }
                return node;
            });
            setNodes(updatedNodes);
        }
    }, [nodes, selectedNode, setNodes]);

    const htmlSenitize = (html) => {
        return sanitizeHtml(html, {
            allowedTags: [
                "b",
                "i",
                "em",
                "strong",
                "ul",
                "li",
                "a",
                "p",
                "br",
                "h1",
                "h2",
                "h3",
                "h4",
                "h5",
                "h6",
            ],
            allowedAttributes: {
                a: ["href", "target"],
            },
            transformTags: {
                a: (tagName, attribs) => {
                    if (attribs.href && !attribs.href.match(/^https?:\/\//)) {
                        attribs.href = "http://" + attribs.href;
                    }
                    attribs.target = "_blank";
                    return {
                        tagName: "a",
                        attribs,
                    };
                },
            },
        });
    };

    const handleInputChange = (event) => {
        const sanitizedHtml = htmlSenitize(event.target.value);
        if (
            selectedNode &&
            selectedNode.type !== "sectionNode" &&
            selectedNode.type !== "nameNode"
        ) {
            const updatedNodes = nodes.map((node) => {
                if (node.id === selectedNode.id) {
                    return {
                        ...node,
                        data: {
                            ...node.data,
                            content: sanitizedHtml,
                        },
                    };
                }
                return node;
            });
            selectedNode.data.content = sanitizedHtml;
            setNodes(updatedNodes);
        }
        setInputContent(event.target.value);
        setResultContent(sanitizedHtml);
    };

    useEffect(() => {
        checkIfEmpty();
    }, [nodes]);

    const checkIfEmpty = () => {
        setIsFlowEmpty(nodes?.length === 0);
    };

    return (
        <Box sx={{ display: "flex", flex: 1 }}>
            <Dialog
                open={openPublish}
                onClose={handleClosePublish}
                maxWidth="sm"
                fullWidth
                PaperProps={{ className: "!rounded-3xl" }}
            >
                <form onSubmit={onSubmit}>
                    <DialogTitle className="!flex !items-center bg-gray-100">
                        <div className="bg-blue-500 rounded-full me-2 text-white">
                            <BackupIcon className="m-2" />
                        </div>
                        Публикация дорожной карты
                    </DialogTitle>
                    <Divider />
                    <DialogContent>
                        <Box display="flex" alignItems="center" mb={1}>
                            <Box>
                                <p className="text-sm text-gray-500">
                                    Заполните все поля для публицации дорожной
                                    карты.
                                </p>
                            </Box>
                        </Box>
                        <input
                            hidden
                            onChange={(e) => setData("json", e.target.value)}
                            value={data.json}
                        />
                        <TextField
                            fullWidth
                            variant="outlined"
                            margin="dense"
                            label="Название"
                            InputProps={{
                                className: "!rounded-xl",
                            }}
                            onChange={(e) => setData("name", e.target.value)}
                            value={data.name}
                            error={Boolean(errors.name)}
                            helperText={errors.name}
                        />

                        <TextField
                            fullWidth
                            variant="outlined"
                            margin="dense"
                            label="Описание"
                            multiline
                            rows={4}
                            inputProps={{
                                maxLength: 1024,
                            }}
                            InputProps={{
                                className: "!rounded-xl",
                            }}
                            onChange={(e) =>
                                setData("description", e.target.value)
                            }
                            value={data.description}
                            error={Boolean(errors.description)}
                            helperText={
                                errors.description
                                    ? errors.description
                                    : "Макс. 1024 символа"
                            }
                        />
                        <TextField
                            fullWidth
                            variant="outlined"
                            margin="dense"
                            label="Теги"
                            InputProps={{
                                className: "!rounded-xl",
                            }}
                            onChange={(e) => setData("tags", e.target.value)}
                            error={Boolean(errors.tags)}
                            helperText={
                                errors.tags
                                    ? errors.tags
                                    : "Через пробел. Пример: unity gamedev gamedesign noob"
                            }
                            value={data.tags}
                        />
                    </DialogContent>
                    <Divider />
                    <DialogActions className="!px-6 !py-4 bg-gray-100">
                        <Button
                            sx={{ textTransform: "none" }}
                            className="!rounded-full !text-gray-500 hover:!text-gray-700 hover:!bg-gray-100 !bg-white !border-gray-300"
                            onClick={handleClosePublish}
                            variant="outlined"
                            color="primary"
                        >
                            Отмена
                        </Button>
                        <Button
                            sx={{ textTransform: "none" }}
                            className="!rounded-full !text-white hover:!text-gray-700 hover:!bg-gray-100 !bg-blue-500 !border-blue-500 hover:!border-gray-300"
                            type="submit"
                            variant="outlined"
                            color="primary"
                        >
                            Опубликовать
                        </Button>
                    </DialogActions>
                </form>
            </Dialog>
            <Dialog
                open={openContent}
                onClose={handleCloseContent}
                maxWidth="xl"
                fullWidth
                PaperProps={{ className: "!rounded-3xl" }}
            >
                <DialogTitle className="!flex !items-center bg-gray-100">
                    <Box className="!bg-blue-500 !rounded-full me-2 text-white">
                        <ArticleIcon className="m-2" />
                    </Box>
                    Содержание узла: "{selectedNode?.data?.label}"
                </DialogTitle>

                <Box className="!my-4 !me-20 !absolute !right-0 top-0 !outline !outline-1 !outline-blue-600 hover:!bg-blue-200 !rounded-full">
                    <MouseOverPopover
                        popoverProps={{
                            PaperProps: {
                                className:
                                    "!rounded-3xl !p-2 !border !border-gray-300",
                            },
                        }}
                        hoverLabel={
                            <QuestionIcon className="text-blue-600 m-2" />
                        }
                    >
                        Поддерживаются следующие теги:
                        <br />
                        &lt;b&gt; - <b>жирный текст</b> <br />
                        &lt;i&gt; - <i>курсив</i>
                        <br />
                        &lt;em&gt; - <em>акцентированный текст</em>
                        <br />
                        &lt;strong&gt; - <strong>сильный акцент</strong>
                        <br />
                        &lt;a&gt; - ссылка (поддерживается атрибут href)
                        <br />
                        &lt;p&gt; - параграф
                        <br />
                        &lt;br&gt; - разрыв строки
                        <br />
                        &lt;h1&gt; - заголовок 1 уровня
                        <br />
                        &lt;h2&gt; - заголовок 2 уровня
                        <br />
                        &lt;h3&gt; - заголовок 3 уровня
                        <br />
                        &lt;h4&gt; - заголовок 4 уровня
                        <br />
                        &lt;h5&gt; - заголовок 5 уровня
                        <br />
                        &lt;h6&gt; - заголовок 6 уровня
                        <br />
                        &lt;ul&gt; - неупорядоченный список
                        <br />
                        &lt;li&gt; - элементов списка
                        <br />
                    </MouseOverPopover>
                </Box>
                <IconButton
                    onClick={handleCloseContent}
                    className="!my-4 !mx-6 !absolute !right-0 top-0 !outline !outline-1 !outline-red-600 hover:!bg-red-200"
                >
                    <ClearIcon className="text-red-600" />
                </IconButton>
                <Divider orientation="horizontal" />
                <DialogContent className="!py-4 !px-5">
                    <Box height="calc(100vh - 170px)">
                        <Grid container spacing={2} className="h-full">
                            <Grid item xs={6} className="h-full">
                                <Box className="h-full flex flex-col">
                                    {/* <label htmlFor="html_code">
                                        Кодовый контекст
                                    </label> */}
                                    <textarea
                                        id="html_code"
                                        className="h-full resize-none border-0 px-2 outline outline-1 outline-slate-300 rounded-xl"
                                        onChange={handleInputChange}
                                        value={inputContent}
                                    />
                                </Box>
                            </Grid>
                            <Grid item xs={6} className="h-full">
                                <Box className="h-full flex flex-col">
                                    {/* <label>Графическое отображение</label> */}
                                    <div
                                        className="html-canvas flex-1 p-2 text-wrap overflow-auto outline outline-1 outline-slate-300 rounded-xl"
                                        dangerouslySetInnerHTML={{
                                            __html: resultContent,
                                        }}
                                    ></div>
                                </Box>
                            </Grid>
                        </Grid>
                    </Box>
                </DialogContent>
                <Divider orientation="horizontal" />
            </Dialog>

            <Drawer
                className="select-none"
                variant="permanent"
                sx={{
                    width: drawerWidth,
                    flexShrink: 0,
                    [`& .MuiDrawer-paper`]: {
                        width: drawerWidth,
                        boxSizing: "border-box",
                        position: "relative",
                    },
                }}
            >
                <InputLabel
                    htmlFor="current_password"
                    value={
                        <Stack
                            direction="row"
                            className="justify-center items-center"
                        >
                            <Box className="p-1 bg-indigo-500 rounded-full me-2">
                                <SquareIcon
                                    fontSize="small"
                                    className="text-white m-1"
                                />
                            </Box>
                            Доступные узлы
                        </Stack>
                    }
                    className="mt-2 !text-base text-center font-semibold"
                />
                <List className="!p-2">
                    <ListItem
                        className="cursor-grab text-gray-500 hover:text-gray-700 mb-2 px-4 py-2 hover:bg-gray-100 bg-white border rounded-full border-gray-300"
                        key="Тема"
                        disablePadding
                        onDragStart={(event) => onDragStart(event, "topicNode")}
                        draggable
                    >
                        <ListItemIcon className="flex justify-center">
                            <BookmarkIcon />
                        </ListItemIcon>
                        <ListItemText
                            primary="Тема"
                            className="ms-1"
                            primaryTypographyProps={{
                                className: "!font-semibold",
                            }}
                        />
                    </ListItem>
                    <ListItem
                        className="cursor-grab text-gray-500 hover:text-gray-700 mb-2 px-4 py-2 hover:bg-gray-100 bg-white border rounded-full border-gray-300"
                        key="Подтема"
                        disablePadding
                        onDragStart={(event) =>
                            onDragStart(event, "subtopicNode")
                        }
                        draggable
                    >
                        <ListItemIcon className="flex justify-center">
                            <BookmarksIcon />
                        </ListItemIcon>
                        <ListItemText
                            primary="Подтема"
                            className="ms-1"
                            primaryTypographyProps={{
                                className: "!font-semibold",
                            }}
                        />
                    </ListItem>
                    <ListItem
                        className="cursor-grab text-gray-500 hover:text-gray-700 mb-2 px-4 py-2 hover:bg-gray-100 bg-white border rounded-full border-gray-300"
                        key="Название"
                        disablePadding
                        onDragStart={(event) => onDragStart(event, "nameNode")}
                        draggable
                    >
                        <ListItemIcon className="flex justify-center">
                            <FontDownloadIcon />
                        </ListItemIcon>
                        <ListItemText
                            primary="Название"
                            className="ms-1"
                            primaryTypographyProps={{
                                className: "!font-semibold",
                            }}
                        />
                    </ListItem>
                    <ListItem
                        className="cursor-grab text-gray-500 hover:text-gray-700 mb-2 px-4 py-2 hover:bg-gray-100 bg-white border rounded-full border-gray-300"
                        key="Раздел"
                        disablePadding
                        onDragStart={(event) =>
                            onDragStart(event, "sectionNode")
                        }
                        draggable
                    >
                        <ListItemIcon className="flex justify-center">
                            <ViewCarouselIcon />
                        </ListItemIcon>
                        <ListItemText
                            primary="Раздел"
                            className="ms-1"
                            primaryTypographyProps={{
                                className: "!font-semibold",
                            }}
                        />
                    </ListItem>
                </List>
                <Divider />
                <InputLabel
                    htmlFor="current_password"
                    value={
                        <Stack
                            direction="row"
                            className="justify-center items-center"
                        >
                            <Box className="p-1 bg-indigo-500 rounded-full me-2">
                                <SettingsIcon
                                    fontSize="small"
                                    className="text-white m-1"
                                />
                            </Box>
                            Настройки узла
                        </Stack>
                    }
                    className="mt-2 !text-base text-center font-semibold"
                />
                <TextInput
                    disabled={!selectedNode}
                    id="node_name"
                    type="text"
                    placeholder="Название узла"
                    value={selectedNodeLabel}
                    onChange={(e) => {
                        setSelectedNodeLabel(e.target.value);
                        if (
                            selectedNode &&
                            selectedNode.type !== "sectionNode"
                        ) {
                            const updatedNodes = nodes.map((node) => {
                                if (node.id === selectedNode.id) {
                                    return {
                                        ...node,
                                        data: {
                                            ...node.data,
                                            label: e.target.value,
                                        },
                                    };
                                }
                                return node;
                            });
                            setNodes(updatedNodes);
                        }
                    }}
                    className="!font-semibold !px-4 !py-3 m-2 hover:border-black text-center !text-base disabled:!opacity-50 disabled:!border-gray-300"
                />
                <Button
                    onClick={onDeleteNode}
                    disabled={!selectedEdge && !selectedNode}
                    sx={{ textTransform: "none" }}
                    variant="outlined"
                    className="!m-2 !rounded-full !px-2 !py-3 !text-gray-500 !border-slate-300 hover:!bg-gray-100 hover:!text-gray-700 !text-base disabled:!opacity-50"
                >
                    <DeleteRoundedIcon className="me-2" />
                    Удалить
                </Button>
                <Button
                    onClick={handleOpenContent}
                    disabled={
                        !selectedNode ||
                        selectedNode?.type === "sectionNode" ||
                        selectedNode?.type === "nameNode"
                    }
                    sx={{ textTransform: "none" }}
                    variant="outlined"
                    className="!m-2 !rounded-full !px-2 !py-3 !text-gray-500 !border-slate-300 hover:!bg-gray-100 hover:!text-gray-700 !text-base disabled:!opacity-50"
                >
                    <ArticleIcon className="me-2" />
                    Содержание
                </Button>
                <Stack
                    direction="row"
                    spacing={1.5}
                    className="justify-center mb-4 mt-2"
                >
                    <IconButton
                        disabled={!selectedNode}
                        size="medium"
                        className="!border-solid !border !border-gray-300 hover:text-gray-700"
                        onClick={setZIndexToLowest}
                    >
                        <KeyboardDoubleArrowDownIcon />
                    </IconButton>
                    <IconButton
                        disabled={!selectedNode}
                        size="medium"
                        className="!border-solid !border !border-gray-300 hover:text-gray-700"
                        onClick={decreaseZIndex}
                    >
                        <KeyboardArrowDownIcon />
                    </IconButton>
                    <IconButton
                        disabled={!selectedNode}
                        size="medium"
                        className="!border-solid !border !border-gray-300 hover:text-gray-700"
                        onClick={increaseZIndex}
                    >
                        <KeyboardArrowUpIcon />
                    </IconButton>
                    <IconButton
                        disabled={!selectedNode}
                        size="medium"
                        className="!border-solid !border !border-gray-300 hover:text-gray-700"
                        onClick={setZIndexToHighest}
                    >
                        <KeyboardDoubleArrowUpIcon />
                    </IconButton>
                </Stack>
                <Divider />
                <InputLabel
                    htmlFor="current_password"
                    value={
                        <Stack
                            direction="row"
                            className="justify-center items-center"
                        >
                            <Box className="p-1 bg-indigo-500 rounded-full me-2">
                                <InsertDriveFileIcon
                                    fontSize="small"
                                    className="text-white m-1"
                                />
                            </Box>
                            Действия с файлом
                        </Stack>
                    }
                    className="mt-2 !text-base text-center font-semibold"
                />
                <Stack
                    direction="column"
                    spacing={1.5}
                    className="justify-center mb-4 mt-2"
                >
                    <Button
                        onClick={onSave}
                        sx={{ textTransform: "none" }}
                        variant="outlined"
                        className="!mx-2 !rounded-full !px-2 !py-3 !text-gray-500 !border-slate-300 hover:!bg-gray-100 hover:!text-gray-700 !text-base disabled:!opacity-50"
                    >
                        <FileDownloadIcon className="me-2" />
                        Сохранить
                    </Button>
                    <Button
                        tabIndex={-1}
                        component="label"
                        role={undefined}
                        sx={{ textTransform: "none" }}
                        variant="outlined"
                        className="!mx-2 !rounded-full !px-2 !py-3 !text-gray-500 !border-slate-300 hover:!bg-gray-100 hover:!text-gray-700 !text-base disabled:!opacity-50"
                    >
                        <FileUploadIcon className="me-2" />
                        Загрузить
                        <input
                            type="file"
                            accept=".json"
                            onChange={handleFileUpload}
                            style={{
                                clip: "rect(0 0 0 0)",
                                clipPath: "inset(50%)",
                                height: 1,
                                overflow: "hidden",
                                position: "absolute",
                                bottom: 0,
                                left: 0,
                                whiteSpace: "nowrap",
                                width: 1,
                            }}
                        />
                    </Button>
                    <ButtonWithPopover
                        label={
                            <div className="flex items-center">
                                <ErrorIcon className="me-2" />
                                Невозможно опубликовать, т.к. диаграмма пуста
                            </div>
                        }
                        buttonProps={{
                            variant: "outlined",
                            className:
                                "!normal-case !mx-2 !rounded-full !px-2 !py-3 !text-gray-500 !border-slate-300 hover:!bg-gray-100 hover:!text-gray-700 !text-base disabled:!opacity-50",
                        }}
                        popoverProps={{
                            PaperProps: {
                                className:
                                    "!mx-2 !py-3 !px-5 !rounded-full !text-white !bg-red-600 !text-base !drop-shadow-md",
                            },
                        }}
                        predicate={() => {
                            return !isFlowEmpty;
                        }}
                        onClick={() => {
                            handleOpen();
                            onPublish();
                        }}
                    >
                        <BackupIcon className="me-2" />
                        Опубликовать
                    </ButtonWithPopover>
                </Stack>
            </Drawer>

            <Box
                component="main"
                sx={{ flexGrow: 1, bgcolor: "background.default" }}
            >
                <div style={{ height: "100%" }} ref={reactFlowWrapper}>
                    <ReactFlow
                        nodes={nodes}
                        edges={edges}
                        onNodesChange={onNodesChange}
                        onEdgesChange={onEdgesChange}
                        nodeTypes={nodeTypes}
                        onConnect={onConnect}
                        connectionLineComponent={ConnectionLine}
                        onInit={setRfInstance}
                        onDrop={onDrop}
                        onDragOver={onDragOver}
                        snapToGrid={true}
                        snapGrid={snapGrid}
                        fitView={false}
                        onPaneClick={() => {
                            if (window.getSelection) {
                                if (window.getSelection().empty) {
                                    window.getSelection().empty();
                                } else if (
                                    window.getSelection().removeAllRanges
                                ) {
                                    window.getSelection().removeAllRanges();
                                }
                            } else if (document.selection) {
                                document.selection.empty();
                            }
                        }}
                    >
                        <Controls className="border-0 outline outline-1 outline-gray-300 rounded-xl" />
                        <MiniMap className="border-0 outline outline-1 outline-gray-300 rounded-xl" />
                        <Background variant="lines" gap={10} />
                    </ReactFlow>
                </div>
            </Box>
        </Box>
    );
};

export default function Editor({ auth, status }) {
    const [open, setOpen] = useState(false);

    useEffect(() => {
        if (status?.time) {
            setOpen(true);
            const timer = setTimeout(() => {
                setOpen(false);
            }, 5000);

            return () => clearTimeout(timer);
        }
    }, [status]);

    return (
        <ReactFlowProvider>
            <Head title="Редактор" />
            <AuthenticatedLayout user={auth.user}>
                <Snackbar
                    anchorOrigin={{
                        horizontal: "center",
                        vertical: "bottom",
                    }}
                    open={open}
                    message={
                        <Stack className="items-center" direction="row">
                            <ErrorIcon className="me-2" />
                            {status?.message}
                        </Stack>
                    }
                    ContentProps={{
                        className:
                            status?.type === "success"
                                ? "!bg-green-600 !justify-center !rounded-full"
                                : "!bg-red-600 !justify-center !rounded-full",
                    }}
                />
                <Canvas />
            </AuthenticatedLayout>
        </ReactFlowProvider>
    );
}
