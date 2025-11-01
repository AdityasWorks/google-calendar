import type { Config } from "tailwindcss";

const config: Config = {
    content: [
        "./pages/**/*.{js,ts,jsx,tsx,mdx}",
        "./components/**/*.{js,ts,jsx,tsx,mdx}",
        "./app/**/*.{js,ts,jsx,tsx,mdx}",
    ],
    theme: {
        extend: {
            keyframes: {
                "fade-in": {
                    "0%": { opacity: "0" },
                    "100%": { opacity: "1" },
                },
                "zoom-in": {
                    "0%": { transform: "scale(0.95)" },
                    "100%": { transform: "scale(1)" },
                },
            },
            animation: {
                "fade-in": "fade-in 0.2s ease-out",
                "zoom-in": "zoom-in 0.2s ease-out",
            },
        },
    },
    plugins: [],
};

export default config;
