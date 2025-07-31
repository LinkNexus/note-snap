import { z } from 'zod'

// User Profile Schemas
export const updateProfileSchema = z.object({
    name: z.string().min(1, 'Name is required').max(100, 'Name must be less than 100 characters'),
    bio: z.string().max(500, 'Bio must be less than 500 characters').optional(),
    website: z.string().url('Invalid website URL').optional().or(z.literal('')),
    github: z.string().optional(),
})

export const updatePasswordSchema = z.object({
    currentPassword: z.string().min(1, 'Current password is required'),
    newPassword: z.string().min(8, 'New password must be at least 8 characters'),
    confirmPassword: z.string().min(1, 'Password confirmation is required'),
}).refine((data) => data.newPassword === data.confirmPassword, {
    message: "New passwords don't match",
    path: ["confirmPassword"],
})

// Authentication Schemas
export const loginSchema = z.object({
    email: z.string().email('Invalid email address'),
    password: z.string().min(1, 'Password is required'),
})

export const signupSchema = z.object({
    name: z.string().min(1, 'Name is required').max(100, 'Name must be less than 100 characters'),
    email: z.string().email('Invalid email address'),
    password: z.string().min(8, 'Password must be at least 8 characters'),
    confirmPassword: z.string().min(1, 'Password confirmation is required'),
}).refine((data) => data.password === data.confirmPassword, {
    message: "Passwords don't match",
    path: ["confirmPassword"],
})

export const forgotPasswordSchema = z.object({
    email: z.string().email('Invalid email address'),
})

export const resetPasswordSchema = z.object({
    token: z.string().min(1, 'Token is required'),
    password: z.string().min(8, 'Password must be at least 8 characters'),
    confirmPassword: z.string().min(1, 'Password confirmation is required'),
}).refine((data) => data.password === data.confirmPassword, {
    message: "Passwords don't match",
    path: ["confirmPassword"],
})

// Email Verification Schemas
export const verifyEmailSchema = z.object({
    token: z.string().min(1, 'Token is required'),
})

export const resendVerificationSchema = z.object({
    email: z.string().email('Invalid email address'),
})

// User Response Schema
export const userSchema = z.object({
    id: z.string(),
    name: z.string().nullable(),
    email: z.string().email(),
    image: z.string().nullable(),
    bio: z.string().nullable(),
    website: z.string().nullable(),
    github: z.string().nullable(),
    emailNotifications: z.boolean().optional(),
    publicProfile: z.boolean().optional(),
    shareAnalytics: z.boolean().optional(),
    emailVerified: z.date().nullable(),
    createdAt: z.date(),
    updatedAt: z.date(),
    accounts: z.array(z.object({
        provider: z.string(),
        type: z.string(),
    })).optional(),
})

// API Response Schemas
export const apiResponseSchema = z.object({
    message: z.string(),
    user: userSchema.optional(),
})

export const apiErrorSchema = z.object({
    error: z.string(),
    details: z.array(z.any()).optional(),
})

// Preferences Schema
export const updatePreferencesSchema = z.object({
    emailNotifications: z.boolean(),
    publicProfile: z.boolean(),
    shareAnalytics: z.boolean(),
})

// Type exports
export type UpdateProfileData = z.infer<typeof updateProfileSchema>
export type UpdatePasswordData = z.infer<typeof updatePasswordSchema>
export type LoginData = z.infer<typeof loginSchema>
export type SignupData = z.infer<typeof signupSchema>
export type ForgotPasswordData = z.infer<typeof forgotPasswordSchema>
export type ResetPasswordData = z.infer<typeof resetPasswordSchema>
export type VerifyEmailData = z.infer<typeof verifyEmailSchema>
export type ResendVerificationData = z.infer<typeof resendVerificationSchema>
export type User = z.infer<typeof userSchema>
export type ApiResponse = z.infer<typeof apiResponseSchema>
export type ApiError = z.infer<typeof apiErrorSchema>
export type UpdatePreferencesData = z.infer<typeof updatePreferencesSchema>
