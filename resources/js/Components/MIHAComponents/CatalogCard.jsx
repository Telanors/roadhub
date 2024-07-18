import * as React from "react";
import {
    Button,
    Card,
    CardHeader,
    CardMedia,
    CardContent,
    CardActions,
    CardActionArea,
    Avatar,
    IconButton,
    Typography,
    Divider,
    Grid,
} from "@mui/material";
import LikeDislikeDisplay from "@/Components/MIHAComponents/LikeDislikeDisplay";
import UserRating from "@/Components/MIHAComponents/UserRating";
import ViewCounter from "@/Components/MIHAComponents/ViewCounter";
import { stringToColor, truncateString } from "@/utilities";
import MoreVertIcon from "@mui/icons-material/MoreVert";

export default function CataloCard({
    entity_id,
    entity_type,
    user,
    href,
    label,
    image,
    updatedAt,
    children,
    views,
    rating,
}) {
    const handleCardClick = async () => {
        try {
            await axios.post(
                route("roadmap.incrementViews", { id: entity_id })
            );
        } catch (error) {
            console.error("Ошибка при увеличении счетчика просмотров:", error);
        }
    };

    return (
        <Card className="!rounded-3xl !shadow-none !drop-shadow-lg">
            <CardHeader
                avatar={
                    <Avatar
                        sx={{ bgcolor: stringToColor(user.name ?? "user") }}
                        aria-label="recipe"
                    >
                        {user?.name[0].toUpperCase()}
                    </Avatar>
                }
                action={
                    <IconButton>
                        <MoreVertIcon />
                    </IconButton>
                }
                title={user?.name}
                subheader={<UserRating value={rating} />}
                className="!bg-gray-50"
            />
            <Divider />
            <CardActionArea
                href={href}
                className="!rounded-none"
                onClick={handleCardClick}
            >
                <CardMedia
                    component="img"
                    height="194"
                    image={image}
                    alt={user?.name}
                />
                <Divider />
                <CardContent>
                    <Typography gutterBottom variant="h5" component="div">
                        {label}
                        <Typography component="div" variant="subtitle2" gutterBottom>
                            Дата обновления: {updatedAt}
                        </Typography>
                    </Typography>

                    <Typography
                        component="div"
                        variant="body2"
                        color="text.secondary"
                        minHeight={125}
                        maxHeight={125}
                        className="!text-balance"
                    >
                        {truncateString(children, 255, "...")}
                    </Typography>
                </CardContent>
            </CardActionArea>
            <Divider />
            <CardActions className="!p-4 !bg-gray-50">
                <Grid container spacing={1} justifyContent="space-between">
                    <Grid item display="flex" alignItems="center">
                        <ViewCounter views={views} />
                    </Grid>
                    <Grid item>
                        <LikeDislikeDisplay
                            entityId={entity_id}
                            entityType={entity_type}
                        />
                    </Grid>
                </Grid>
            </CardActions>
        </Card>
    );
}
