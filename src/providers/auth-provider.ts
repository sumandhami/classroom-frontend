import { AuthProvider } from "@refinedev/core";
import { authClient } from "@/lib/auth";

export const authProvider: AuthProvider = {
    login: async ({ email, password }) => {

        const { data, error } = await authClient.signIn.email({
            email,
            password,
        });

        if (error) {

            return {
                success: false,
                error: {
                    name: "Login Error",
                    message: error.message || "Invalid email or password",
                },
            };
        }

        return {
            success: true,
            redirectTo: "/",
        };
    },
    logout: async () => {
        const { error } = await authClient.signOut();

        if (error) {
            return {
                success: false,
                error: {
                    name: "Logout Error",
                    message: error.message || "Failed to logout",
                },
            };
        }
        return {
            success: true,
            redirectTo: "/login",
        };
    },
   check: async () => {
        try {
            const { data: session } = await authClient.getSession();
            if (session) {
                return {
                    authenticated: true,
                };
            }
        } catch (error) {
            console.error("Auth check failed:", error);
            // ✅ Return unauthenticated instead of throwing
        }

        return {
            authenticated: false,
            logout: true,
            redirectTo: "/login",
        };
    },
    getPermissions: async () => {
        const { data: session } = await authClient.getSession();
        if (session) {
            return (session.user as any).role;
        }
        return null;
    },
    getIdentity: async () => {
        const { data: session } = await authClient.getSession();
        if (session) {
            return {
                ...session.user,
                id: session.user.id,
                name: session.user.name,
                avatar: session.user.image,
            };
        }
        return null;
    },
    onError: async (error) => {
        const statusCode = error?.statusCode ?? error?.status;
        if (statusCode === 401 || statusCode === 403) {
            return {
                logout: true,
                redirectTo: "/login",
                error,
            };
        }

        return { error };
    },
};
