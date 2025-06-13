

export const HttpMethods = {
    GET: "GET",
    POST: "POST",
    PUT: "PUT",
    PATCH: "PATCH",
    DELETE: "DELETE",
} as const;

export type HttpMethod = "GET" | "POST" | "PUT" | "PATCH" | "DELETE";