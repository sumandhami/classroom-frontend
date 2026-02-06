import { useEffect, useState } from "react";
import { authClient } from "@/lib/auth";
import { useNavigate, useSearchParams } from "react-router";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { useNotification } from "@refinedev/core";
import { Loader2, CheckCircle2, XCircle } from "lucide-react";

export default function VerifyEmailPage() {
    const [searchParams] = useSearchParams();
    const token = searchParams.get("token");
    const [status, setStatus] = useState<"loading" | "success" | "error">("loading");
    const [message, setMessage] = useState("");
    const navigate = useNavigate();
    const { open } = useNotification();

    useEffect(() => {
        if (!token) {
            setStatus("error");
            setMessage("Invalid verification link.");
            return;
        }

        const verify = async () => {
            const { error } = await authClient.verifyEmail({
                query: { token }
            });

            if (error) {
                setStatus("error");
                setMessage(error.message || "Email verification failed.");
            } else {
                setStatus("success");
                setMessage("Your email has been successfully verified.");
                open?.({
                    type: "success",
                    message: "Email Verified",
                    description: "You can now access all features."
                });
            }
        };

        verify();
    }, [token, open]);

    return (
        <div className="flex items-center justify-center min-h-screen bg-muted/40">
            <Card className="w-full max-w-md">
                <CardHeader className="text-center">
                    <CardTitle className="text-2xl">Email Verification</CardTitle>
                    <CardDescription>
                        {status === "loading" && "Verifying your email..."}
                        {status === "success" && "Verification complete!"}
                        {status === "error" && "Verification failed"}
                    </CardDescription>
                </CardHeader>
                <CardContent className="flex flex-col items-center justify-center py-6">
                    {status === "loading" && (
                        <Loader2 className="w-12 h-12 animate-spin text-primary" />
                    )}
                    {status === "success" && (
                        <div className="text-center space-y-4">
                            <CheckCircle2 className="w-12 h-12 text-green-500 mx-auto" />
                            <p className="text-muted-foreground">{message}</p>
                            <Button onClick={() => navigate("/")} className="w-full">
                                Go to Dashboard
                            </Button>
                        </div>
                    )}
                    {status === "error" && (
                        <div className="text-center space-y-4">
                            <XCircle className="w-12 h-12 text-destructive mx-auto" />
                            <p className="text-muted-foreground">{message}</p>
                            <Button onClick={() => navigate("/login")} className="w-full">
                                Back to Login
                            </Button>
                        </div>
                    )}
                </CardContent>
            </Card>
        </div>
    );
}
