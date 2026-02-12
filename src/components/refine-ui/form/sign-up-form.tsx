import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { signUp } from "@/lib/auth";

import { InputPassword } from "@/components/refine-ui/form/input-password";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
import { cn } from "@/lib/utils";
import {
  useLink,
  useNotification,
  useRefineOptions,
} from "@refinedev/core";
import { useNavigate } from "react-router";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { organizationSignUpSchema, type OrganizationSignUpFormValues } from "@/lib/schema";
import { UploadWidgetValue } from "@/types";
import UploadWidget from "@/components/upload-widget";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";

export const SignUpForm = () => {
  const [loading, setLoading] = useState(false);
  const [logo, setLogo] = useState<UploadWidgetValue | null>(null);

  const { open } = useNotification();
  const navigate = useNavigate();
  const Link = useLink();
  const { title } = useRefineOptions();

  const form = useForm<OrganizationSignUpFormValues>({
    resolver: zodResolver(organizationSignUpSchema),
    defaultValues: {
      organizationName: "",
      organizationType: "school",
      organizationEmail: "",
      organizationPhone: "",
      organizationAddress: "",
      adminName: "",
      adminEmail: "",
      adminPassword: "",
      confirmPassword: "",
    },
  });

  const onSubmit = async (data: OrganizationSignUpFormValues) => {
    setLoading(true);

    try {
      const { error } = await signUp.email({
        email: data.adminEmail,
        password: data.adminPassword,
        name: data.adminName,
         organizationData: {
          organizationName: data.organizationName,
          organizationType: data.organizationType,
          organizationEmail: data.organizationEmail,
          organizationPhone: data.organizationPhone || null,
          organizationAddress: data.organizationAddress || null,
          organizationLogo: logo?.url || null,
          organizationLogoCldPubId: logo?.publicId || null,
        },
      } as any);

      if (error) {
        open?.({
          type: "error",
          message: "Registration failed",
          description: error.message || "An error occurred during registration.",
        });
      } else {
        open?.({
          type: "success",
          message: "Organization registered successfully!",
          description: "A verification email has been sent. Please check your inbox.",
        });
        navigate("/login", { 
          state: { 
            email: data.adminEmail,
            organizationName: data.organizationName 
          } 
        });
      }
    } catch (err: any) {
      open?.({
        type: "error",
        message: "Registration failed",
        description: err.message || "An unexpected error occurred.",
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className={cn("flex", "flex-col", "items-center", "justify-center", "px-6", "py-8", "min-h-svh")}>
      <div className={cn("flex", "items-center", "justify-center", "gap-2")}>
        {title.icon && (
          <div className={cn("text-foreground", "[&>svg]:w-12", "[&>svg]:h-12")}>
            {title.icon}
          </div>
        )}
      </div>

      <Card className={cn("sm:w-[600px]", "p-12", "mt-6")}>
        <CardHeader className={cn("px-0")}>
          <CardTitle className={cn("text-green-600", "dark:text-green-400", "text-3xl", "font-semibold")}>
            Register Organization
          </CardTitle>
          <CardDescription className={cn("text-muted-foreground", "font-medium")}>
            Create your organization and admin account
          </CardDescription>
        </CardHeader>

        <Separator />

        <CardContent className={cn("px-0", "mt-6")}>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
              <div className="space-y-4">
                <h3 className="text-lg font-semibold">Organization Details</h3>
                
                <div className={cn("flex", "flex-col", "gap-2", "items-center")}>
                  <Label>Organization Logo</Label>
                  <UploadWidget value={logo} onChange={(val) => setLogo(val)} />
                  <p className="text-xs text-muted-foreground">Optional: Upload your organization's logo</p>
                </div>

                <FormField
                  control={form.control}
                  name="organizationName"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Organization Name *</FormLabel>
                      <FormControl>
                        <Input placeholder="ABC University" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="organizationType"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Organization Type *</FormLabel>
                      <Select onValueChange={field.onChange} defaultValue={field.value}>
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue placeholder="Select type" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          <SelectItem value="school">School</SelectItem>
                          <SelectItem value="college">College</SelectItem>  
                          <SelectItem value="university">University</SelectItem>
                          <SelectItem value="coaching">Coaching Center</SelectItem>
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="organizationEmail"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Organization Email *</FormLabel>
                      <FormControl>
                        <Input type="email" placeholder="contact@organization.edu" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="organizationPhone"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Phone</FormLabel>
                      <FormControl>
                        <Input placeholder="+1 234 567 8900" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="organizationAddress"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Address</FormLabel>
                      <FormControl>
                        <Input placeholder="123 Main St, City" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>

              <Separator />

              <div className="space-y-4">
                <h3 className="text-lg font-semibold">Admin Account</h3>
                
                <FormField
                  control={form.control}
                  name="adminName"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Your Name *</FormLabel>
                      <FormControl>
                        <Input placeholder="John Doe" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="adminEmail"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Your Email *</FormLabel>
                      <FormControl>
                        <Input type="email" placeholder="admin@org.edu" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="adminPassword"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Password *</FormLabel>
                      <FormControl>
                        <InputPassword {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="confirmPassword"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Confirm Password *</FormLabel>
                      <FormControl>
                        <InputPassword {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>

              <Button
                type="submit"
                size="lg"
                className={cn("w-full", "bg-green-600", "hover:bg-green-700", "text-white")}
                disabled={loading}
              >
                {loading ? "Registering..." : "Register Organization"}
              </Button>
            </form>
          </Form>
        </CardContent>

        <Separator />

        <CardFooter>
          <div className={cn("w-full", "text-center text-sm")}>
            <span className={cn("text-sm", "text-muted-foreground")}>
              Already have an account?{" "}
            </span>
            <Link to="/login" className={cn("text-blue-600", "dark:text-blue-400", "font-semibold", "underline")}>
              Sign in
            </Link>
          </div>
        </CardFooter>
      </Card>
    </div>
  );
};

SignUpForm.displayName = "SignUpForm";