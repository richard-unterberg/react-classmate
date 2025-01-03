import babel from "@rollup/plugin-babel"
import commonjs from "@rollup/plugin-commonjs"
import resolve from "@rollup/plugin-node-resolve"
import typescript from "@rollup/plugin-typescript"
import dts from "rollup-plugin-dts"
import { minify } from "rollup-plugin-esbuild-minify"

export default [
  {
    input: "src/index.ts",
    output: [
      {
        file: "dist/index.js",
        format: "es",
      },
      {
        file: "dist/index.cjs.js",
        format: "cjs",
      },
    ],
    plugins: [
      typescript({
        tsconfig: "./tsconfig.json",
      }),
      resolve({ extensions: [".ts", ".tsx"] }),
      commonjs(),
      babel({
        babelHelpers: "bundled",
        extensions: [".ts", ".tsx"],
      }),
      minify(),
    ],
    external: ["react", "react-dom"],
  },
  {
    input: "./dist/types/index.d.ts",
    output: [{ file: "dist/index.d.ts", format: "es" }],
    plugins: [dts()],
  },
]
