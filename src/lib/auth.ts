import { createAuthClient } from "better-auth/react";

const rawBaseUrl = import.meta.env.VITE_BACKEND_BASE_URL;
if (!rawBaseUrl) {
        throw new Error("VITE_BACKEND_BASE_URL is required");
    }

export const authClient = createAuthClient({
        baseURL: rawBaseUrl.endsWith("/api") ? rawBaseUrl.slice(0, -4) : rawBaseUrl,

    fetchOptions: {
        credentials: "include",
    },

    user: {
        additionalFields: {
            role: {
                type: "string",
                required: true,
            },
            imageCldPubId: {
                type: "string",
            },
        }
    }
});

export const { signIn, signUp, useSession, signOut } = authClient;