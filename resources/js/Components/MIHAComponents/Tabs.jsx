import * as React from "react";
import PropTypes from "prop-types";
import Tabs from "@mui/material/Tabs";
import Tab from "@mui/material/Tab";
import Typography from "@mui/material/Typography";
import Box from "@mui/material/Box";
import CatalogCard from "@/Components/MIHAComponents/CatalogCard";

import BookmarkIcon from "@mui/icons-material/Bookmark";
import AccountCircleIcon from "@mui/icons-material/AccountCircle";

function CustomTabPanel(props) {
    const { children, value, index, ...other } = props;

    return (
        <div
            role="tabpanel"
            hidden={value !== index}
            id={`simple-tabpanel-${index}`}
            aria-labelledby={`simple-tab-${index}`}
            {...other}
        >
            {value === index && (
                <Box>
                    <Typography>{children}</Typography>
                </Box>
            )}
        </div>
    );
}

CustomTabPanel.propTypes = {
    children: PropTypes.node,
    index: PropTypes.number.isRequired,
    value: PropTypes.number.isRequired,
};

function a11yProps(index) {
    return {
        id: `simple-tab-${index}`,
        "aria-controls": `simple-tabpanel-${index}`,
        className: "!normal-case",
    };
}

export default function BasicTabs({ user }) {
    const [value, setValue] = React.useState(0);
    const [roadmaps, setRoadmaps] = React.useState([]);
    const [rating, setRating] = React.useState(0);

    React.useEffect(() => {
        const fetchUserRoadmaps = async () => {
            try {
                const response = await fetch(`/user/${user.id}/roadmaps`);
                const data = await response.json();
                setRoadmaps(data);
            } catch (error) {
                console.error("Error fetching roadmaps:", error);
            }
        };

        fetchUserRoadmaps();
        const fetchRating = async () => {
            try {
                const response = await axios.get(
                    route("likes.getUserLikesCountByEntityType", {
                        userId: user.id,
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
        fetchRating();
    }, [user]);

    const handleChange = (event, newValue) => {
        setValue(newValue);
    };

    return (
        <Box sx={{ width: "100%" }}>
            <Box sx={{ borderBottom: 1, borderColor: "divider" }}>
                <Tabs
                    value={value}
                    onChange={handleChange}
                    aria-label="basic tabs example"
                >
                    <Tab
                        label={
                            <Box display="flex" alignItems="center">
                                <AccountCircleIcon className="me-1" />
                                <Typography
                                    variant="subtitle1"
                                    className="!font-normal"
                                >
                                    Моё
                                </Typography>
                            </Box>
                        }
                        {...a11yProps(0)}
                    />
                    <Tab
                        label={
                            <Box display="flex" alignItems="center">
                                <BookmarkIcon className="me-1" />
                                <Typography
                                    variant="subtitle1"
                                    className="!font-normal"
                                >
                                    Избранное
                                </Typography>
                            </Box>
                        }
                        {...a11yProps(1)}
                    />
                </Tabs>
            </Box>
            <CustomTabPanel value={value} index={0}>
                <div className="pt-6 grid grid-cols-3 gap-4 ">
                    {roadmaps.length > 0 &&
                        roadmaps.map((roadmap) => (
                            <CatalogCard
                                key={roadmap.id}
                                entity_id={roadmap.id}
                                user={user}
                                entity_type="roadmap"
                                className="w-full"
                                updatedAt={roadmap.updated_at}
                                image={roadmap.preview_path}
                                label={roadmap.name}
                                rating={rating}
                                views={roadmap.views}
                                href={route("catalog.show", roadmap.id)}
                            >
                                {roadmap.description}
                            </CatalogCard>
                        ))}
                </div>
            </CustomTabPanel>
            <CustomTabPanel value={value} index={1}>
                <div className="pt-6 grid grid-cols-3 gap-4 ">
                    <CatalogCard
                        user={{ name: "telanors" }}
                        entity_type="roadmap"
                        className="w-full"
                        updatedAt="26.05.2024 в 01:03"
                        image="/roadmaps/previews/roadmap_1716355081.jpeg"
                        label="Базовая дорожная карта"
                        rating={1.7}
                        views={31}
                        href={route("catalog.show", 6)}
                    >
                        Базовая карта 1024 (или base map 1024) — это концепция,
                        часто используемая в контексте географических
                        информационных систем (ГИС), картографии и
                        веб-картографии. Основная функция базовой карты
                        заключается в предоставлении фоновой информации, которая
                        служит основой для отображения других слоев данных и
                        географической информации. Вот основные характеристики и
                        функции базовой карты: Разрешение 1024x1024 пикселей:
                        Размер карты составляет 1024 пикселя по каждой стороне,
                        что обеспечивает достаточную детализацию для базовой
                        визуализации и дальнейшего наложения данных. Фон для
                        данных: Базовая карта служит основным слоем, на который
                        накладываются другие слои данных, такие как точки
                        интереса, маршруты, зоны и т.д. Типы базовых карт: Это
                        могут быть различные типы карт, включая топографические,
                        спутниковые, политические, физические и другие карты,
                        которые используются в зависимости от задач и целей
                        проекта.
                    </CatalogCard>
                </div>
            </CustomTabPanel>
        </Box>
    );
}
