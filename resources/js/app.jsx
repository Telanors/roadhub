import "./bootstrap";
import "@css/app.css";

import { ThemeProvider, createTheme } from "@mui/material/styles";
import { createRoot } from "react-dom/client";
import { createInertiaApp } from "@inertiajs/react";
import { resolvePageComponent } from "laravel-vite-plugin/inertia-helpers";

const appName = import.meta.env.VITE_APP_NAME || "Laravel";

const theme = createTheme({
    typography: {
        fontFamily: 'Figtree, ui-sans-serif, system-ui, sans-serif, "Apple Color Emoji", "Segoe UI Emoji", "Segoe UI Symbol", "Noto Color Emoji"',
    },
    palette: {
        secondary: {
            main: "#9e9e9e", // Серый цвет для основной вариации
            light: "#cfcfcf", // Более светлый серый
            dark: "#707070", // Более темный серый
            contrastText: "#ffffff", // Контрастный текст, белый
        },
    },
});

createInertiaApp({
    title: (title) => `${title} - ${appName}`,
    resolve: (name) =>
        resolvePageComponent(
            `./Pages/${name}.jsx`,
            import.meta.glob("./Pages/**/*.jsx")
        ),
    setup({ el, App, props }) {
        const root = createRoot(el);

        root.render(
            <ThemeProvider theme={theme}>
                <App {...props} />
            </ThemeProvider>
        );
    },
    progress: {
        color: "#4B5563",
    },
});
