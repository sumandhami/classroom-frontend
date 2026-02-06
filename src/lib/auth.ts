import { createAuthClient } from "better-auth/react";

export const authClient = createAuthClient({
    baseURL: import.meta.env.VITE_BACKEND_BASE_URL.endsWith('/api')
        ? import.meta.env.VITE_BACKEND_BASE_URL.slice(0, -4)
        : import.meta.env.VITE_BACKEND_BASE_URL,

    fetchOptions: {
        credentials: "include", // ✅ This is all you need for cookies!
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