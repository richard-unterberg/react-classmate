import path from "node:path"
import react from "@vitejs/plugin-react"
import UnoCSS from "unocss/vite"
import vike from "vike/plugin"
import { defineConfig } from "vite"
import rawPlugin from "vite-raw-plugin"

export default defineConfig({
  plugins: [
    vike({
      prerender: true,
    }),
    rawPlugin({
      fileRegex: /\.rcx$/,
    }),
    UnoCSS(),
    react({}),
  ],
  ssr: {
    noExternal: ["react-syntax-highlighter"],
  },
  resolve: {
    alias: {
      "#hooks": path.resolve(__dirname, "./lib/hooks/"),
      "#zustand": path.resolve(__dirname, "./lib/zustand/"),
      "#lib": path.resolve(__dirname, "./lib/"),
      "#pages": path.resolve(__dirname, "./pages/"),
      "#layout": path.resolve(__dirname, "./layout/"),
      "#components": path.resolve(__dirname, "./components/"),
      "#root": __dirname,
    },
  },
})