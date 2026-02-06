import { useSession, signOut } from "@/lib/auth";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { useNavigate } from "react-router";
import { User, LogOut, LogIn, UserPlus } from "lucide-react";
import { useNotification } from "@refinedev/core";

export default function AccountPage() {
    const { data: session, isPending } = useSession();
    const navigate = useNavigate();
    const { open } = useNotification();

    if (isPending) {
        return <div className="flex items-center justify-center h-full">Loading...</div>;
    }

    if (!session) {
        return (
            <div className="flex flex-col items-center justify-center h-[calc(100vh-200px)] gap-6">
                <Card className="w-[400px]">
                    <CardHeader className="text-center">
                        <CardTitle className="text-2xl font-bold">Account</CardTitle>
                        <CardDescription>
                            Please login or sign up to manage your account.
                        </CardDescription>
                    </CardHeader>
                    <CardContent className="flex flex-col gap-4">
                        <Button 
                            className="w-full" 
                            onClick={() => navigate("/login")}
                        >
                            <LogIn className="mr-2 h-4 w-4" />
                            Login
                        </Button>
                        <Button 
                            variant="outline" 
                            className="w-full" 
                            onClick={() => navigate("/register")}
                        >
                            <UserPlus className="mr-2 h-4 w-4" />
                            Sign Up
                        </Button>
                    </CardContent>
                </Card>
            </div>
        );
    }

    return (
        <div className="container mx-auto py-10">
            <h1 className="text-3xl font-bold mb-6">My Account</h1>
            <div className="grid gap-6">
                <Card>
                    <CardHeader>
                        <CardTitle className="flex items-center gap-2">
                            <User className="h-5 w-5" />
                            Profile Information
                        </CardTitle>
                        <CardDescription>
                            View and manage your account details.
                        </CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-4">
                        <div className="flex items-center gap-4">
                            <div className="h-20 w-20 rounded-full bg-muted flex items-center justify-center overflow-hidden">
                                {session.user.image ? (
                                    <img src={session.user.image} alt={session.user.name} className="h-full w-full object-cover" />
                                ) : (
                                    <User className="h-10 w-10 text-muted-foreground" />
                                )}
                            </div>
                            <div>
                                <h2 className="text-xl font-semibold">{session.user.name}</h2>
                                <p className="text-sm text-muted-foreground">{session.user.email}</p>
                                <div className="mt-1">
                                    <span className="inline-flex items-center rounded-full bg-blue-100 px-2.5 py-0.5 text-xs font-medium text-blue-800 dark:bg-blue-900 dark:text-blue-300">
                                        {(session.user as any).role}
                                    </span>
                                </div>
                            </div>
                        </div>
                        <div className="pt-4 border-t">
                            <Button 
                                variant="destructive" 
                                onClick={async () => {
                                    const { error } = await signOut();
                                    if (error) {
                                        open?.({
                                            type: "error",
                                            message: "Logout failed",
                                            description: error.message || "An error occurred while signing out.",
                                        });
                                    } else {
                                        navigate("/login");
                                    }
                                }}
                            >
                                <LogOut className="mr-2 h-4 w-4" />
                                Sign Out
                            </Button>
                        </div>
                    </CardContent>
                </Card>
            </div>
        </div>
    );
}
