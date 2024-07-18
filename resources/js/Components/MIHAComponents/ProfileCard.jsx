import React from "react";
import PropTypes from "prop-types";
import { Avatar, Button, Stack } from "@mui/material";
import SettingsIcon from "@mui/icons-material/Settings";
import { styled } from "@mui/material/styles";
import { stringToColor } from "@/utilities";
import UserRating from "@/Components/MIHAComponents/UserRating";

const Root = styled("div")({
    paddingTop: "0.5rem",
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    backgroundColor: "white",
    overflow: "hidden",
});

const Background = styled("div")({
    width: "100%",
    height: "200px",
    backgroundSize: "cover",
    backgroundPosition: "center",
});

const AvatarContainer = styled("div")({
    display: "flex",
    width: "100%",
    justifyContent: "flex-start",
    marginTop: "-80px",
    padding: "0px 20px",
    zIndex: 1,
});

const AvatarStyled = styled(Avatar)(({ theme }) => ({
    fontSize: "4rem",
    width: "160px",
    height: "160px",
    border: "4px solid white",
}));

const UserInfo = styled("div")({
    marginTop: "75px",
    display: "flex",
    flexDirection: "column",
    alignItems: "flex-start",
    paddingTop: "16px",
    marginLeft: "16px",
    width: "100%",
    justifyContent: "space-between",
});

const Name = styled("div")({
    fontSize: "1.5rem",
    fontWeight: "bold",
});

const Email = styled("div")({
    fontSize: "1rem",
    color: "#555",
});

const ProfileCard = ({ backgroundUrl, name, email, rating }) => {
    return (
        <Root>
            <Background
                className="!rounded-xl"
                style={{ backgroundImage: `url(${backgroundUrl})` }}
            />
            <AvatarContainer>
                <AvatarStyled
                    sx={{
                        bgcolor: stringToColor(name),
                    }}
                    alt={name}
                >
                    {name[0].toUpperCase()}
                </AvatarStyled>
                <UserInfo>
                    <Stack
                        direction="row"
                        className="w-full"
                        justifyContent="space-between"
                    >
                        <div>
                            <Stack
                                direction="row"
                                spacing={1.5}
                                alignItems="baseline"
                            >
                                <Name>{name}</Name>
                                <Email>{email}</Email>
                            </Stack>
                            <UserRating value={rating}></UserRating>
                        </div>
                        <div>
                            <Button
                                href={route("profile.edit")}
                                className="!rounded-full !normal-case"
                                variant="contained"
                                color="secondary"
                                startIcon={<SettingsIcon />}
                            >
                                Настройки
                            </Button>
                        </div>
                    </Stack>
                </UserInfo>
            </AvatarContainer>
        </Root>
    );
};

ProfileCard.propTypes = {
    backgroundUrl: PropTypes.string,
    name: PropTypes.string,
    email: PropTypes.string,
};

ProfileCard.defaultProps = {
    backgroundUrl:
        "https://catherineasquithgallery.com/uploads/posts/2023-01/1674303635_catherineasquithgallery-com-p-fon-serii-kvadratiki-foto-186.jpg",
    name: "Unknown User",
    email: "unknown@example.com",
};

export default ProfileCard;
