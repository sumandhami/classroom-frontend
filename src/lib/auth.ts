import { createAuthClient } from "better-auth/react";

const rawBaseUrl = import.meta.env.VITE_BACKEND_BASE_URL;
console.log("🔧 [Auth] Raw backend URL:", rawBaseUrl);

if (!rawBaseUrl) {
    throw new Error("VITE_BACKEND_BASE_URL is required");
}

// ✅ Keep full URL with /api/auth
const baseURL = rawBaseUrl.replace(/\/$/, '') + '/auth'; // http://localhost:8000/api/auth
console.log("🔧 [Auth] Final base URL:", baseURL);

export const authClient = createAuthClient({
    baseURL, // http://localhost:8000/api/auth
    // ✅ NO basePath needed - it's already in baseURL

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
            organizationId: {
                type: "string",
            },
        }
    }
});

export const { signIn, signUp, useSession, signOut } = authClient;