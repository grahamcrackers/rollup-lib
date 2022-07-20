import esbuild from "rollup-plugin-esbuild";
import banner from "rollup-plugin-banner";
import license from "rollup-plugin-license";
import serve from "rollup-plugin-serve";
import pkg from "./package.json";

const isProduction = process.env.NODE_ENV === "production";

export default {
    input: `src/index.ts`,
    output: [
        {
            dir: "dist",
            entryFileNames: "umd.[name].js",
            format: "umd",
            name: "myBundle",
            sourcemap: isProduction,
        },
    ],
    plugins: [
        esbuild({
            // All options are optional
            include: /\.[jt]sx?$/, // default, inferred from `loaders` option
            exclude: /node_modules/, // default
            sourceMap: false, // by default inferred from rollup's `output.sourcemap` option
            minify: process.env.NODE_ENV === "production",
            target: "es2017", // default, or 'es20XX', 'esnext'
            // Like @rollup/plugin-replace
            define: {
                __VERSION__: `"${pkg.version}"`,
                __DEV__: process.env.NODE_ENV !== "production",
            },
            tsconfig: "tsconfig.json",
        }),
        // banner("<%= pkg.name %> \nv<%= pkg.version %> \nby <%= pkg.author %>"),
        license({
            sourceMap: isProduction,
            banner: "<%= pkg.name %> \nv<%= pkg.version %> \nby <%= pkg.author %>",
        }),
        !isProduction && serve({ contentBase: "dist", port: 8080 }),
    ].filter(Boolean),
};
