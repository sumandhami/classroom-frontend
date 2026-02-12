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
        console.log("🔍 [Auth] Checking authentication...");
        
        try {
            const { data: session, error } = await authClient.getSession();
            console.log("📦 [Auth] Session response:", { session, error });
            
            if (session?.user) {
                console.log("✅ [Auth] User is authenticated");
                return {
                    authenticated: true,
                };
            }
        } catch (error) {
            console.error("❌ [Auth] Check error:", error);
        }

        console.log("🚫 [Auth] Not authenticated, redirecting...");
        return {
            authenticated: false,
            redirectTo: "/login", // ✅ REMOVED logout: true
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
    if (session?.user) {
        const user = session.user as any;
        
        // ✅ Fetch organization data if user has organizationId
        let organization = null;
        if (user.organizationId) {
            try {
                const orgResponse = await fetch(
                    `${import.meta.env.VITE_BACKEND_BASE_URL}/organization/${user.organizationId}`,
                    {
                        credentials: 'include',
                    }
                );
                if (orgResponse.ok) {
                    const orgData = await orgResponse.json();
                    organization = orgData.data;
                }
            } catch (error) {
                console.error("Failed to fetch organization:", error);
            }
        }
        
        return {
            ...user,
            id: user.id,
            name: user.name,
            avatar: user.image,
            organization, // ✅ Add organization data
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