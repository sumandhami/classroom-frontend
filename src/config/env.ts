import * as z from "zod";

const envSchema = z.object({
    VITE_CLOUDINARY_UPLOAD_URL: z.string().url("Invalid Cloudinary upload URL"),
    VITE_CLOUDINARY_CLOUD_NAME: z.string().min(1, "Cloudinary cloud name is required"),
    VITE_BACKEND_BASE_URL: z.string().url("Invalid backend base URL"),
    // VITE_API_URL: z.string().url("Invalid API URL"),
    // VITE_ACCESS_TOKEN_KEY: z.string().min(1, "Access token key is required"),
    // VITE_REFRESH_TOKEN_KEY: z.string().min(1, "Refresh token key is required"),
    VITE_CLOUDINARY_UPLOAD_PRESET: z.string().min(1, "Cloudinary upload preset is required"),
});

const _env = envSchema.safeParse(import.meta.env);

if (!_env.success) {
    const errorMessages = _env.error.errors
        .map((err) => `${err.path.join(".")}: ${err.message}`)
        .join("\n");
    console.error("❌ Invalid environment variables:\n" + errorMessages);
    throw new Error("Invalid environment variables:\n" + errorMessages);
}

export const env = _env.data;
