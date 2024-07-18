import React from "react";
import { styled } from "@mui/material/styles";
import {
    Container,
    Typography,
    Button,
    Divider,
    Grid,
    Chip,
} from "@mui/material";
import { Link, Head } from "@inertiajs/react";
import AuthenticatedLayout from "@/Layouts/AuthenticatedLayout";

const MainContainer = styled("div")({
    backgroundColor: "white",
    display: "flex",
    flexDirection: "column",
    justifyContent: "center",
    alignItems: "center",
    padding: (theme) => theme.spacing(4),
    textAlign: "center",
    color: (theme) => theme.palette.common.white,
});

const Background = styled("div")({
    width: "100%",
    height: "100%",
});

const Title = styled(Typography)({
    margin: "50px 0px 30px 0px",
    backgroundSize: "cover",
    backgroundPosition: "center",
});

const Description = styled(Typography)({
    margin: "30px 0px",
});

const StyledButton = styled(Button)({
    margin: (theme) => theme.spacing(1),
});
export default function Home({ user }) {
    return (
        <>
            <Head title="Главная" />
            <AuthenticatedLayout user={user} className="!bg-white">
                <MainContainer>
                    <Background className="!bg-gray-100">
                        <Container maxWidth="md">
                            <Title
                                variant="h2"
                                className="!font-extrabold !bg-clip-text !text-transparent !bg-gradient-to-r !to-gray-800 !from-gray-500"
                            >
                                Добро пожаловать на Roadhub!
                            </Title>
                            <Description
                                variant="h6"
                                gutterBottom
                                className="!text-balance !font-normal"
                            >
                                Мы – сообщество, которое стремится делиться
                                знаниями и опытом, чтобы помочь вам стать более
                                уверенным разработчиком видеоигр. На Roadhub вы
                                найдете образовательные дорожные карты,
                                созданные нашими участниками специально для
                                обучения. Независимо от того, новичок ли вы или
                                опытный разработчик, у нас есть ресурсы, чтобы
                                помочь вам приобрести новые навыки или улучшить
                                старые.
                            </Description>
                            <Button
                                className="!shadow-lg !text-xl !text-white !uppercase !font-semibold !px-6 !py-4 !mb-12 !rounded-full !bg-gradient-to-r !to-blue-700 !from-blue-500 hover:!from-pink-500 hover:!to-yellow-500"
                                variant="contained"
                                color="primary"
                                size="large"
                                href={route("catalog")}
                            >
                                Начать обучение
                            </Button>
                        </Container>
                    </Background>

                    <div className="divider">
                        <div
                            className="divider-text !shadow-lg !text-lg !px-6 !py-2"
                            style={{ width: "225px", height: "50px" }}
                        >
                            Категории
                        </div>
                        <div className="divider-line"></div>
                    </div>
                    <Grid
                        container
                        justifyContent="center"
                        className="!mt-1"
                        spacing={2}
                    >
                        <Grid item>
                            <StyledButton
                                variant="outlined"
                                color="secondary"
                                className="!border-black !bg-white !text-gray-500 !normal-case !rounded-full !text-lg !px-6 !py-2"
                                style={{ width: "225px", height: "50px" }}
                                href={route("catalog", { tags: "1" })}
                            >
                                Unity
                            </StyledButton>
                        </Grid>
                        <Grid item>
                            <StyledButton
                                variant="outlined"
                                color="secondary"
                                className="!border-black !bg-white !text-gray-500 !normal-case !rounded-full !text-lg !px-6 !py-2"
                                style={{ width: "225px", height: "50px" }}
                                href={route("catalog", { tags: "1" })}
                            >
                                Геймплей
                            </StyledButton>
                        </Grid>
                        <Grid item>
                            <StyledButton
                                variant="outlined"
                                color="secondary"
                                className="!border-black !bg-white !text-gray-500 !normal-case !rounded-full !text-lg !px-6 !py-2"
                                style={{ width: "225px", height: "50px" }}
                                href={route("catalog", { tags: "1" })}
                            >
                                Дизайн персонажей
                            </StyledButton>
                        </Grid>
                    </Grid>
                    <Grid
                        container
                        justifyContent="center"
                        spacing={2}
                        className="!mt-1"
                    >
                        <Grid item>
                            <StyledButton
                                variant="outlined"
                                color="secondary"
                                className="!border-black !bg-white !text-gray-500 !normal-case !rounded-full !text-lg !px-6 !py-2"
                                style={{ width: "225px", height: "50px" }}
                                href={route("catalog", { tags: "1" })}
                            >
                                Дизайн уровней
                            </StyledButton>
                        </Grid>
                        <Grid item>
                            <StyledButton
                                variant="outlined"
                                color="secondary"
                                className="!border-black !bg-white !text-gray-500 !normal-case !rounded-full !text-lg !px-6 !py-2"
                                style={{ width: "225px", height: "50px" }}
                                href={route("catalog", { tags: "1" })}
                            >
                                Игровые механники
                            </StyledButton>
                        </Grid>
                        <Grid item>
                            <StyledButton
                                variant="outlined"
                                color="secondary"
                                className="!border-black !bg-white !text-gray-500 !normal-case !rounded-full !text-lg !px-6 !py-2"
                                style={{ width: "225px", height: "50px" }}
                                href={route("catalog", { tags: "1" })}
                            >
                                История
                            </StyledButton>
                        </Grid>
                    </Grid>
                    <Grid
                        container
                        justifyContent="center"
                        spacing={2}
                        className="!mt-1"
                    >
                        <Grid item>
                            <StyledButton
                                variant="outlined"
                                color="secondary"
                                className="!border-black !bg-white !text-gray-500 !normal-case !rounded-full !text-lg !px-6 !py-2"
                                style={{ width: "225px", height: "50px" }}
                                href={route("catalog", { tags: "1" })}
                            >
                                Графика
                            </StyledButton>
                        </Grid>
                        <Grid item>
                            <StyledButton
                                variant="outlined"
                                color="secondary"
                                className="!border-black !bg-white !text-gray-500 !normal-case !rounded-full !text-lg !px-6 !py-2"
                                style={{ width: "225px", height: "50px" }}
                                href={route("catalog", { tags: "1" })}
                            >
                                Анимация
                            </StyledButton>
                        </Grid>
                        <Grid item>
                            <StyledButton
                                variant="outlined"
                                color="secondary"
                                className="!border-black !bg-white !text-gray-500 !normal-case !rounded-full !text-lg !px-6 !py-2"
                                style={{ width: "225px", height: "50px" }}
                                href={route("catalog", { tags: "1" })}
                            >
                                Дизайн звука
                            </StyledButton>
                        </Grid>
                    </Grid>
                    <Grid
                        container
                        justifyContent="center"
                        spacing={2}
                        className="!mt-1"
                        style={{ height: "120px" }}
                    >
                        <Grid item>
                            <StyledButton
                                variant="outlined"
                                color="secondary"
                                className="!border-black !bg-white !text-gray-500 !normal-case !rounded-full !text-lg !px-6 !py-2"
                                style={{ width: "225px", height: "50px" }}
                                href={route("catalog", { tags: "1" })}
                            >
                                Движки
                            </StyledButton>
                        </Grid>
                        <Grid item>
                            <StyledButton
                                variant="outlined"
                                color="secondary"
                                className="!border-black !bg-white !text-gray-500 !normal-case !rounded-full !text-lg !px-6 !py-2"
                                style={{ width: "225px", height: "50px" }}
                                href={route("catalog", { tags: "1" })}
                            >
                                Физика
                            </StyledButton>
                        </Grid>
                        <Grid item>
                            <StyledButton
                                variant="outlined"
                                color="secondary"
                                className="!border-black !bg-white !text-gray-500 !normal-case !rounded-full !text-lg !px-6 !py-2"
                                style={{ width: "225px", height: "50px" }}
                                href={route("catalog", { tags: "1" })}
                            >
                                Интерфейс
                            </StyledButton>
                        </Grid>
                    </Grid>
                </MainContainer>
            </AuthenticatedLayout>
        </>
    );
}
