import {
    ApiResponse,
    UpdatePasswordData,
    UpdatePreferencesData,
    UpdateProfileData,
    User
} from '@/lib/validations'
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'

// Profile API functions
const fetchProfile = async (): Promise<User> => {
    const response = await fetch('/api/profile')
    if (!response.ok) {
        throw new Error('Failed to fetch profile')
    }
    const data = await response.json()
    return data.user
}

const updateProfile = async (data: UpdateProfileData): Promise<ApiResponse> => {
    const response = await fetch('/api/profile', {
        method: 'PUT',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({
            type: 'profile',
            ...data,
        }),
    })

    if (!response.ok) {
        const error = await response.json()
        throw new Error(error.error || 'Failed to update profile')
    }

    return response.json()
}

const updatePassword = async (data: UpdatePasswordData): Promise<ApiResponse> => {
    const response = await fetch('/api/profile', {
        method: 'PUT',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({
            type: 'password',
            ...data,
        }),
    })

    if (!response.ok) {
        const error = await response.json()
        throw new Error(error.error || 'Failed to update password')
    }

    return response.json()
}

const updatePreferences = async (data: UpdatePreferencesData): Promise<ApiResponse> => {
    const response = await fetch('/api/profile', {
        method: 'PUT',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({
            type: 'preferences',
            ...data,
        }),
    })

    if (!response.ok) {
        const error = await response.json()
        throw new Error(error.error || 'Failed to update preferences')
    }

    return response.json()
}

const deleteAccount = async (): Promise<ApiResponse> => {
    const response = await fetch('/api/profile', {
        method: 'DELETE',
    })

    if (!response.ok) {
        const error = await response.json()
        throw new Error(error.error || 'Failed to delete account')
    }

    return response.json()
}

// React Query hooks
export const useProfile = () => {
    return useQuery({
        queryKey: ['profile'],
        queryFn: fetchProfile,
        staleTime: 5 * 60 * 1000, // 5 minutes
    })
}

export const useUpdateProfile = () => {
    const queryClient = useQueryClient()

    return useMutation({
        mutationFn: updateProfile,
        onSuccess: (data) => {
            // Update the profile cache with the new data
            queryClient.setQueryData(['profile'], data.user)
            // Invalidate to refetch if needed
            queryClient.invalidateQueries({ queryKey: ['profile'] })
        },
        onError: (error) => {
            console.error('Profile update error:', error)
        },
    })
}

export const useUpdatePassword = () => {
    return useMutation({
        mutationFn: updatePassword,
        onError: (error) => {
            console.error('Password update error:', error)
        },
    })
}

export const useUpdatePreferences = () => {
    const queryClient = useQueryClient()

    return useMutation({
        mutationFn: updatePreferences,
        onSuccess: (data) => {
            // Update the profile cache with the new data
            queryClient.setQueryData(['profile'], data.user)
            // Invalidate to refetch if needed
            queryClient.invalidateQueries({ queryKey: ['profile'] })
        },
        onError: (error) => {
            console.error('Preferences update error:', error)
        },
    })
}

export const useDeleteAccount = () => {
    const queryClient = useQueryClient()

    return useMutation({
        mutationFn: deleteAccount,
        onSuccess: () => {
            // Clear all queries on account deletion
            queryClient.clear()
        },
        onError: (error) => {
            console.error('Account deletion error:', error)
        },
    })
}

// Authentication API functions
const forgotPassword = async (data: { email: string }) => {
    const response = await fetch('/api/auth/forgot-password', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify(data),
    })

    if (!response.ok) {
        const error = await response.json()
        throw new Error(error.error || 'Failed to send reset email')
    }

    return response.json()
}

const resetPassword = async (data: { token: string; password: string; confirmPassword: string }) => {
    const response = await fetch('/api/auth/reset-password', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify(data),
    })

    if (!response.ok) {
        const error = await response.json()
        throw new Error(error.error || 'Failed to reset password')
    }

    return response.json()
}

const verifyEmail = async (data: { token: string }) => {
    const response = await fetch('/api/auth/verify-email', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify(data),
    })

    if (!response.ok) {
        const error = await response.json()
        throw new Error(error.error || 'Email verification failed')
    }

    return response.json()
}

const resendVerification = async (data: { email: string }) => {
    const response = await fetch('/api/auth/resend-verification', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify(data),
    })

    if (!response.ok) {
        const error = await response.json()
        throw new Error(error.error || 'Failed to resend verification email')
    }

    return response.json()
}

// Authentication hooks
export const useForgotPassword = () => {
    return useMutation({
        mutationFn: forgotPassword,
        onError: (error) => {
            console.error('Forgot password error:', error)
        },
    })
}

export const useResetPassword = () => {
    return useMutation({
        mutationFn: resetPassword,
        onError: (error) => {
            console.error('Reset password error:', error)
        },
    })
}

export const useVerifyEmail = () => {
    return useMutation({
        mutationFn: verifyEmail,
        onError: (error) => {
            console.error('Email verification error:', error)
        },
    })
}

export const useResendVerification = () => {
    return useMutation({
        mutationFn: resendVerification,
        onError: (error) => {
            console.error('Resend verification error:', error)
        },
    })
}
