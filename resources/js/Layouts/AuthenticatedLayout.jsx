import { useState } from "react";
import ApplicationLogo from "@/Components/ApplicationLogo";
import Dropdown from "@/Components/Dropdown";
import NavLink from "@/Components/NavLink";
import ResponsiveNavLink from "@/Components/ResponsiveNavLink";
import { Link } from "@inertiajs/react";
import { Avatar, TextField, IconButton, Divider } from "@mui/material";
import {
    HomeRounded as HomeRoundedIcon,
    DesignServicesRounded as BorderColorRoundedIcon,
    LibraryBooksRounded as MapRoundedIcon,
    NotificationsRounded as NotificationsRoundedIcon,
    SearchRounded as SearchRoundedIcon,
    PersonRounded as PersonRoundedIcon,
    ExpandMoreRounded as ExpandMoreRoundedIcon,
    LogoutRounded as LogoutRoundedIcon,
    LoginRounded as LoginRoundedIcon,
    SettingsRounded as SettingsIcon,
    AccountCircleRounded as AccountIcon,
} from "@mui/icons-material";
import { stringToColor } from "@/utilities";

export default function Authenticated({ user, header, children, bgcolor }) {
    const [showingNavigationDropdown, setShowingNavigationDropdown] =
        useState(false);

    return (
        <div className="min-h-screen bg-gray-100 flex flex-col">
            <nav className="bg-white border-b border-black-100 shadow-md sticky top-0 z-50">
                <div className="max-w-7xl  mx-auto px-6">
                    <div className="flex justify-between h-16">
                        <div className="flex">
                            <div className="shrink-0 flex items-center">
                                <Link href={route("home")}>
                                    <ApplicationLogo />
                                </Link>
                            </div>

                            <div className="hidden space-x-8 sm:-my-px sm:ms-10 sm:flex">
                                <NavLink
                                    href={route("home")}
                                    active={route().current("home")}
                                >
                                    <HomeRoundedIcon
                                        color="inherit"
                                        className="!me-2"
                                    />
                                    Главная
                                </NavLink>
                                <NavLink
                                    href={route("editor")}
                                    active={route().current("editor")}
                                >
                                    <BorderColorRoundedIcon
                                        color="inherit"
                                        className="!me-2"
                                    />
                                    Редактор
                                </NavLink>
                                <NavLink
                                    href={route("catalog")}
                                    active={route().current("catalog")}
                                >
                                    <MapRoundedIcon
                                        color="inherit"
                                        className="!me-2"
                                    />
                                    Каталог
                                </NavLink>
                            </div>
                        </div>

                        <div className="hidden sm:flex sm:items-center sm:ms-10 ">
                            {/* <TextField
                                placeholder="Поиск..."
                                variant="outlined"
                                size="small"
                                className="!me-3"
                                InputProps={{
                                    className: "!rounded-full !p-0",
                                    endAdornment: (
                                        <IconButton position="end">
                                            <SearchRoundedIcon color="inherit" />
                                        </IconButton>
                                    ),
                                }}
                            /> */}

                            {user && (
                                <>
                                    <IconButton className="relative hover:text-gray-700 text-gray-500">
                                        <NotificationsRoundedIcon color="inherit" />
                                    </IconButton>
                                    <div className="relative">
                                        <Dropdown>
                                            <Dropdown.Trigger>
                                                <span className="inline-flex rounded-md">
                                                    <button
                                                        type="button"
                                                        className="inline-flex items-center ps-3 py-2 border border-transparent text-sm leading-4 font-medium rounded-md text-gray-500 bg-white hover:text-gray-700 focus:outline-none transition ease-in-out duration-150"
                                                    >
                                                        <Avatar
                                                            className="relative text-white hover:text-gray-200"
                                                            alt={user.name}
                                                            sx={{
                                                                width: 40,
                                                                height: 40,
                                                                bgcolor:
                                                                    stringToColor(
                                                                        user.name ??
                                                                            "user"
                                                                    ),
                                                            }}
                                                        >
                                                            {user?.name[0].toUpperCase()}
                                                        </Avatar>
                                                        <ExpandMoreRoundedIcon color="inherit" />
                                                    </button>
                                                </span>
                                            </Dropdown.Trigger>

                                            <Dropdown.Content>
                                                <div className="px-4 pt-2">
                                                    <div className="font-medium text-base text-gray-800">
                                                        {user.name}
                                                    </div>
                                                    <div className="font-medium text-sm text-gray-500">
                                                        {user.email}
                                                    </div>
                                                </div>
                                                <Dropdown.Link
                                                    href={route("profile.index")}
                                                    className="flex items-center"
                                                >
                                                    <AccountIcon
                                                        color="inherit"
                                                        className="!me-2"
                                                    />
                                                    Профиль
                                                </Dropdown.Link>
                                                <Dropdown.Link
                                                    href={route("profile.edit")}
                                                    className="flex items-center"
                                                >
                                                    <SettingsIcon
                                                        color="inherit"
                                                        className="!me-2"
                                                    />
                                                    Настройки
                                                </Dropdown.Link>
                                                <Divider />
                                                <Dropdown.Link
                                                    href={route("logout")}
                                                    className="flex items-center"
                                                    method="post"
                                                    as="button"
                                                >
                                                    <LogoutRoundedIcon
                                                        color="inherit"
                                                        className="!me-2"
                                                    />
                                                    Выйти
                                                </Dropdown.Link>
                                            </Dropdown.Content>
                                        </Dropdown>
                                    </div>
                                </>
                            )}
                            {!user && (
                                <Link
                                    href={route("login")}
                                    className="!font-semibold flex items-center ms-3 text-gray-500 hover:text-gray-700"
                                >
                                    <LoginRoundedIcon
                                        color="inherit"
                                        className="!me-2"
                                    />
                                    Войти
                                </Link>
                            )}
                        </div>

                        <div className="-me-2 flex items-center sm:hidden">
                            <button
                                onClick={() =>
                                    setShowingNavigationDropdown(
                                        (previousState) => !previousState
                                    )
                                }
                                className="inline-flex items-center justify-center p-2 rounded-md text-gray-400 hover:text-gray-500 hover:bg-gray-100 focus:outline-none focus:bg-gray-100 focus:text-gray-500 transition duration-150 ease-in-out"
                            >
                                <svg
                                    className="h-6 w-6"
                                    stroke="currentColor"
                                    fill="none"
                                    viewBox="0 0 24 24"
                                >
                                    <path
                                        className={
                                            !showingNavigationDropdown
                                                ? "inline-flex"
                                                : "hidden"
                                        }
                                        strokeLinecap="round"
                                        strokeLinejoin="round"
                                        strokeWidth="2"
                                        d="M4 6h16M4 12h16M4 18h16"
                                    />
                                    <path
                                        className={
                                            showingNavigationDropdown
                                                ? "inline-flex"
                                                : "hidden"
                                        }
                                        strokeLinecap="round"
                                        strokeLinejoin="round"
                                        strokeWidth="2"
                                        d="M6 18L18 6M6 6l12 12"
                                    />
                                </svg>
                            </button>
                        </div>
                    </div>
                </div>

                <div
                    className={
                        (showingNavigationDropdown ? "block" : "hidden") +
                        " sm:hidden"
                    }
                >
                    <div className="pt-2 pb-3 space-y-1">
                        <ResponsiveNavLink
                            href={route("home")}
                            active={route().current("home")}
                        >
                            Главная
                        </ResponsiveNavLink>
                        <ResponsiveNavLink
                            href={route("editor")}
                            active={route().current("editor")}
                        >
                            Редактор
                        </ResponsiveNavLink>
                        <ResponsiveNavLink
                            href={route("catalog")}
                            active={route().current("catalog")}
                        >
                            Каталог
                        </ResponsiveNavLink>
                    </div>
                    {user && (
                        <div className="pt-4 pb-1 border-t border-gray-200">
                            <div className="px-4">
                                <div className="font-medium text-base text-gray-800">
                                    {user.name}
                                </div>
                                <div className="font-medium text-sm text-gray-500">
                                    {user.email}
                                </div>
                            </div>

                            <div className="mt-3 space-y-1">
                                <ResponsiveNavLink href={route("profile.edit")}>
                                    Настройки
                                </ResponsiveNavLink>
                                <ResponsiveNavLink
                                    method="post"
                                    href={route("logout")}
                                    as="button"
                                >
                                    Выйти
                                </ResponsiveNavLink>
                            </div>
                        </div>
                    )}
                </div>
            </nav>

            {header && (
                <header className="mt-6">
                    <div className="rounded-xl max-w-7xl bg-white shadow-md mx-auto py-4 px-6">
                        {header}
                    </div>
                </header>
            )}
            {children}
        </div>
    );
}
