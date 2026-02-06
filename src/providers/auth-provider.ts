import { AuthProvider } from "@refinedev/core";
import { authClient } from "@/lib/auth";

export const authProvider: AuthProvider = {
    login: async ({ email, password }) => {
        console.log(`[AuthProvider] Attempting login for ${email}`);
        const { data, error } = await authClient.signIn.email({
            email,
            password,
        });

        if (error) {
            console.log(`[AuthProvider] Login failed:`, error);
            return {
                success: false,
                error: {
                    name: "Login Error",
                    message: error.message || "Invalid email or password",
                },
            };
        }

        if (data?.token) {
            console.log(`[AuthProvider] Login success! Token received: ${data.token.substring(0, 10)}...`);
            // Better Auth automatically stores the token in cookies
            // You don't need to manually save it to localStorage
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
        const { data: session } = await authClient.getSession();
        if (session) {
            return {
                authenticated: true,
            };
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
        if (error.statusCode === 401 || error.statusCode === 403) {
            return {
                logout: true,
                redirectTo: "/login",
            };
        }

        return { error };
    },
};
