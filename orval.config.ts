import { defineConfig } from "orval";

const openApiTarget =
    "https://webfull-9-10-sabujak-be.onrender.com/openapi.json";

export default defineConfig({
    sabujak: {
        input: {
            target: openApiTarget,
        },
        output: {
            target: "./src/shared/api/generated/index.ts",
            schemas: "./src/shared/api/generated/model",
            client: "react-query",
            httpClient: "axios",
            mode: "tags-split",
            clean: true,
            override: {
                mutator: {
                    path: "./src/shared/api/orval/mutator.ts",
                    name: "customInstance",
                },
            },
        },
    },
});
