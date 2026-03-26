import { createSwaggerSpec } from "next-swagger-doc";

export function getApiDocs() {
    return createSwaggerSpec({
        apiFolder: "app/api",
        definition: {
            openapi: "3.0.0",
            info: {
                title: "Talka API",
                version: "1.0.0",
            },
            components: {
                securitySchemes: {
                    LineSignature: {
                        type: "apiKey",
                        in: "header",
                        name: "x-line-signature",
                    },
                },
            },
        },
    });
}