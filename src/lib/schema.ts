import * as z from "zod";

export const facultySchema = z.object({
    name: z.string().min(2, "Name must be at least 2 characters"),
    email: z.string().email("Invalid email address"),
    role: z.enum(["admin", "teacher", "student"], {
        required_error: "Please select a role",
    }),
    department: z.string(),
    image: z.string().optional(),
    imageCldPubId: z.string().optional(),
});

export const subjectSchema = z.object({
    name: z
        .string({ required_error: "Subject name is required" })
        .trim()
        .min(3, "Subject name must be at least 3 characters")
        .max(255, "Subject name must be at most 255 characters"),
    code: z
        .string({ required_error: "Subject code is required" })
        .trim()
        .toUpperCase()
        .min(2, "Subject code must be at least 2 characters")
        .max(50, "Subject code must be at most 50 characters"),
    description: z
        .string()
        .trim()
        .min(5, "Subject description must be at least 5 characters")
        .max(500, "Subject description must be at most 500 characters")
        .optional()
        .default(""),
    departmentId: z.coerce
        .number({
            required_error: "Department is required",
            invalid_type_error: "Department is required",
        })
        .min(1, "Department is required"),
});

export type SubjectFormValues = z.infer<typeof subjectSchema>;


const scheduleSchema = z.object({
    day: z.string().min(1, "Day is required"),
    startTime: z.string().min(1, "Start time is required"),
    endTime: z.string().min(1, "End time is required"),
});

export const classSchema = z.object({
    name: z
        .string()
        .min(2, "Class name must be at least 2 characters")
        .max(50, "Class name must be at most 50 characters"),
    description: z
        .string({ required_error: "Description is required" })
        .min(5, "Description must be at least 5 characters"),
    subjectId: z.coerce
        .number({
            required_error: "Subject is required",
            invalid_type_error: "Subject is required",
        })
        .min(1, "Subject is required"),
    teacherId: z.string().min(1, "Teacher is required"),
    capacity: z.coerce
        .number({
            required_error: "Capacity is required",
            invalid_type_error: "Capacity is required",
        })
        .min(1, "Capacity must be at least 1"),
    status: z.enum(["active", "inactive"]),
    bannerUrl: z
        .string({ required_error: "Class banner is required" })
        .min(1, "Class banner is required"),
    bannerCldPubId: z
        .string({ required_error: "Banner reference is required" })
        .min(1, "Banner reference is required"),
    inviteCode: z.string().optional(),
    schedules: z.array(scheduleSchema).optional(),
});

export const enrollmentSchema = z.object({
    classId: z.coerce
        .number({
            required_error: "Class ID is required",
            invalid_type_error: "Class ID is required",
        })
        .min(1, "Class ID is required"),
    studentId: z.string().min(1, "Student ID is required"),
});

export const departmentSchema = z.object({
    code: z
        .string({ required_error: "Code is required" })
        .trim()
        .toUpperCase()
        .min(1, "Code is required")
        .max(50, "Code must be at most 50 characters"),
    name: z
        .string({ required_error: "Name is required" })
        .trim()
        .min(2, "Name must be at least 2 characters")
        .max(255, "Name must be at most 255 characters"),
    description: z
        .string()
        .trim()
        .max(255, "Description must be at most 255 characters")
        .optional()
        .default(""),
});

export const departmentUpdateSchema = departmentSchema.partial().extend({
    id: z.number().int().positive(),
});

export type DepartmentFormValues = z.infer<typeof departmentSchema>;
export type DepartmentUpdateValues = z.infer<typeof departmentUpdateSchema>;

// ✅ NEW: Organization registration schema
export const organizationSignUpSchema = z.object({
    // Organization details
    organizationName: z
        .string({ required_error: "Organization name is required" })
        .min(2, "Organization name must be at least 2 characters")
        .max(255, "Organization name must be at most 255 characters"),
    organizationType: z.enum(["school", "college", "university", "coaching"], {
        required_error: "Please select organization type",
    }),
    organizationEmail: z
        .string({ required_error: "Organization email is required" })
        .email("Invalid email address"),
    organizationPhone: z
        .string()
        .min(10, "Phone number must be at least 10 characters")
        .optional()
        .or(z.literal("")),
    organizationAddress: z
        .string()
        .min(5, "Address must be at least 5 characters")
        .optional()
        .or(z.literal("")),
    
    // Admin user details
    adminName: z
        .string({ required_error: "Admin name is required" })
        .min(2, "Admin name must be at least 2 characters")
        .max(255, "Admin name must be at most 255 characters"),
    adminEmail: z
        .string({ required_error: "Admin email is required" })
        .email("Invalid email address"),
    adminPassword: z
        .string({ required_error: "Password is required" })
        .min(8, "Password must be at least 8 characters")
        .regex(/[A-Z]/, "Password must contain at least one uppercase letter")
        .regex(/[a-z]/, "Password must contain at least one lowercase letter")
        .regex(/[0-9]/, "Password must contain at least one number"),
    confirmPassword: z
        .string({ required_error: "Please confirm your password" }),
}).refine((data) => data.adminPassword === data.confirmPassword, {
    message: "Passwords don't match",
    path: ["confirmPassword"],
});

export type OrganizationSignUpFormValues = z.infer<typeof organizationSignUpSchema>;