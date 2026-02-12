import { AuthProvider } from "@refinedev/core";
import { authClient } from "@/lib/auth";
import { axiosInstance } from "@/providers/data";

// ✅ Simple cache for organization data
let organizationCache: { [userId: string]: { data: any; timestamp: number } } = {};
const CACHE_DURATION = 5 * 60 * 1000; // 5 minutes

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

        // ✅ Clear cache on login
        organizationCache = {};

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

        // ✅ Clear cache on logout
        organizationCache = {};

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
        if (session?.user) {
            const user = session.user as any;
            
            let organization = null;
            if (user.organizationId) {
                // ✅ Check cache first
                const cached = organizationCache[user.id];
                const now = Date.now();
                
                if (cached && (now - cached.timestamp) < CACHE_DURATION) {
                    console.log("📦 [Auth] Using cached organization data");
                    organization = cached.data;
                } else {
                    // ✅ Fetch using axiosInstance instead of raw fetch
                    try {
                        const response = await axiosInstance.get(
                            `/organization/${user.organizationId}`
                        );
                        organization = response.data?.data || response.data;
                        
                        // ✅ Cache the result
                        organizationCache[user.id] = {
                            data: organization,
                            timestamp: now,
                        };
                        console.log("✅ [Auth] Organization data fetched and cached");
                    } catch (error) {
                        console.error("❌ [Auth] Failed to fetch organization:", error);
                    }
                }
            }
            
            return {
                ...user,
                id: user.id,
                name: user.name,
                avatar: user.image,
                organization,
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