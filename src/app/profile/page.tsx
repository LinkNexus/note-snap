'use client'

import { EmailVerificationBanner, useEmailVerification } from "@/components/email-verification-banner"
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from "@/components/ui/alert-dialog"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Separator } from "@/components/ui/separator"
import { Switch } from "@/components/ui/switch"
import { Textarea } from "@/components/ui/textarea"
import { useDeleteAccount, useProfile, useUpdatePassword, useUpdatePreferences, useUpdateProfile } from "@/hooks/use-api"
import { updatePasswordSchema, updateProfileSchema } from "@/lib/validations"
import {
    Calendar,
    Check,
    Edit2,
    Eye,
    EyeOff,
    Github,
    Globe,
    Key,
    Mail,
    Save,
    Settings,
    Shield,
    Trash2,
    User,
    X
} from "lucide-react"
import { signOut, useSession } from "next-auth/react"
import Link from "next/link"
import { useEffect, useState } from "react"
import { toast } from "sonner"
import { z } from "zod"

export default function ProfilePage() {
    const { data: session } = useSession()
    const { isVerified, requiresVerification } = useEmailVerification()

    // React Query hooks
    const { data: profileData, isLoading: isProfileLoading, error: profileError } = useProfile()
    const updateProfileMutation = useUpdateProfile()
    const updatePasswordMutation = useUpdatePassword()
    const updatePreferencesMutation = useUpdatePreferences()
    const deleteAccountMutation = useDeleteAccount()

    const [isEditing, setIsEditing] = useState(false)
    const [isEditingPassword, setIsEditingPassword] = useState(false)
    const [showCurrentPassword, setShowCurrentPassword] = useState(false)
    const [showNewPassword, setShowNewPassword] = useState(false)
    const [showConfirmPassword, setShowConfirmPassword] = useState(false)
    const [formErrors, setFormErrors] = useState<Record<string, string>>({})
    const [passwordErrors, setPasswordErrors] = useState<Record<string, string>>({})
    const [showDeleteDialog, setShowDeleteDialog] = useState(false)

    const [formData, setFormData] = useState({
        name: '',
        email: '',
        bio: '',
        website: '',
        github: '',
        currentPassword: '',
        newPassword: '',
        confirmPassword: '',
    })

    const [preferences, setPreferences] = useState({
        emailNotifications: true,
        publicProfile: false,
        shareAnalytics: true,
    })

    // Update form data when profile data loads
    useEffect(() => {
        if (profileData) {
            setFormData({
                name: profileData.name || '',
                email: profileData.email || '',
                bio: profileData.bio || '',
                website: profileData.website || '',
                github: profileData.github || '',
                currentPassword: '',
                newPassword: '',
                confirmPassword: '',
            })
            setPreferences({
                emailNotifications: profileData.emailNotifications ?? true,
                publicProfile: profileData.publicProfile ?? false,
                shareAnalytics: profileData.shareAnalytics ?? true,
            })
        }
    }, [profileData])

    const getUserInitials = (name?: string | null) => {
        if (!name) return 'U'
        return name.split(' ').map(n => n[0]).join('').toUpperCase().slice(0, 2)
    }

    const getUserName = (name?: string | null) => {
        if (!name) return 'USER'
        return name.toUpperCase().replace(' ', '_')
    }

    // Show loading state
    if (isProfileLoading) {
        return (
            <div className="min-h-screen bg-black text-foreground font-mono flex items-center justify-center">
                <div className="text-center">
                    <div className="w-8 h-8 mx-auto mb-4 animate-spin rounded-full border-2 border-border border-t-primary" />
                    <div>LOADING_PROFILE.exe</div>
                </div>
            </div>
        )
    }

    // Show error state
    if (profileError) {
        return (
            <div className="min-h-screen bg-black text-foreground font-mono flex items-center justify-center">
                <div className="text-center">
                    <div className="text-destructive mb-4">ERROR: Failed to load profile</div>
                    <Button onClick={() => window.location.reload()} className="bg-primary/10 text-foreground">
                        Retry
                    </Button>
                </div>
            </div>
        )
    }

    const handleSave = async () => {
        try {
            // Validate form data
            const validatedData = updateProfileSchema.parse({
                name: formData.name,
                bio: formData.bio,
                website: formData.website,
                github: formData.github,
            })

            await updateProfileMutation.mutateAsync(validatedData)
            setIsEditing(false)
            setFormErrors({})
            toast.success('Profile updated successfully')
        } catch (error) {
            if (error instanceof z.ZodError) {
                const errors: Record<string, string> = {}
                error.errors.forEach((err) => {
                    if (err.path[0]) {
                        errors[err.path[0] as string] = err.message
                    }
                })
                setFormErrors(errors)
                toast.error('Please fix the validation errors')
            } else {
                console.error('Error updating profile:', error)
                toast.error(error instanceof Error ? error.message : 'Failed to update profile')
            }
        }
    }

    const handleCancel = () => {
        setFormData({
            name: profileData?.name || '',
            email: profileData?.email || '',
            bio: profileData?.bio || '',
            website: profileData?.website || '',
            github: profileData?.github || '',
            currentPassword: '',
            newPassword: '',
            confirmPassword: '',
        })
        setIsEditing(false)
    }

    const handleDeleteAccount = async () => {
        try {
            await deleteAccountMutation.mutateAsync()
            toast.success('Account deleted successfully. You will be redirected.')
            // Wait a bit before signing out to show the success message
            setTimeout(() => {
                signOut({ callbackUrl: '/' })
            }, 2000)
        } catch (error) {
            console.error('Error deleting account:', error)
            toast.error(error instanceof Error ? error.message : 'Failed to delete account')
        }
        setShowDeleteDialog(false)
    }

    const handlePasswordChange = async () => {
        try {
            // Validate password data
            const validatedData = updatePasswordSchema.parse({
                currentPassword: formData.currentPassword,
                newPassword: formData.newPassword,
                confirmPassword: formData.confirmPassword,
            })

            await updatePasswordMutation.mutateAsync(validatedData)

            // Clear password fields
            setFormData({
                ...formData,
                currentPassword: '',
                newPassword: '',
                confirmPassword: '',
            })

            toast.success('Password updated successfully')
            setIsEditingPassword(false)
            setPasswordErrors({})
        } catch (error) {
            if (error instanceof z.ZodError) {
                const errors: Record<string, string> = {}
                error.errors.forEach((err) => {
                    if (err.path[0]) {
                        errors[err.path[0] as string] = err.message
                    }
                })
                setPasswordErrors(errors)
                toast.error('Please fix the validation errors')
            } else {
                console.error('Error updating password:', error)
                toast.error(error instanceof Error ? error.message : 'Failed to update password')
            }
        }
    }

    const handlePreferenceChange = async (key: keyof typeof preferences, value: boolean) => {
        const newPreferences = { ...preferences, [key]: value }
        setPreferences(newPreferences)

        try {
            await updatePreferencesMutation.mutateAsync(newPreferences)
            toast.success('Preferences updated successfully')
        } catch (error) {
            // Revert the change on error
            setPreferences(preferences)
            toast.error(error instanceof Error ? error.message : 'Failed to update preferences')
        }
    }

    return (
        <div className="min-h-screen bg-background cyber-grid text-foreground">
            {/* Header */}
            <header className="border-b border-border bg-card/50 backdrop-blur-sm sticky top-0 z-50">
                <div className="container mx-auto px-4 py-3 sm:py-4">
                    <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2 sm:gap-4">
                            <Link href="/dashboard" className="text-primary hover:text-primary/80 transition-colors">
                                <div className="text-lg sm:text-xl font-bold font-mono">NOTE_SNAP</div>
                            </Link>
                            <div className="text-muted-foreground hidden sm:block">/</div>
                            <div className="text-sm sm:text-base font-mono text-primary">PROFILE</div>
                        </div>
                        <div className="flex items-center gap-2 sm:gap-4">
                            <Badge variant="outline" className="hidden sm:flex text-xs">
                                {getUserName(session?.user?.name)}
                            </Badge>
                            <Link href="/dashboard">
                                <Button variant="outline" size="sm" className="text-xs sm:text-sm">
                                    <span className="hidden sm:inline">Back to Dashboard</span>
                                    <span className="sm:hidden">Back</span>
                                </Button>
                            </Link>
                        </div>
                    </div>
                </div>
            </header>

            {/* Email Verification Banner */}
            {requiresVerification && (
                <div className="border-b border-border">
                    <EmailVerificationBanner />
                </div>
            )}

            <div className="container mx-auto px-4 py-6 sm:py-8">
                <div className="max-w-4xl mx-auto space-y-6 sm:space-y-8">
                    {/* Profile Header */}
                    <Card className="bg-card border-border">
                        <CardHeader className="pb-4">
                            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                                <div className="flex items-center gap-4">
                                    <Avatar className="w-16 h-16 sm:w-20 sm:h-20 border-2 border-border">
                                        <AvatarImage src={session?.user?.image || undefined} />
                                        <AvatarFallback className="bg-muted text-muted-foreground text-lg font-mono">
                                            {getUserInitials(session?.user?.name)}
                                        </AvatarFallback>
                                    </Avatar>
                                    <div className="min-w-0 flex-1">
                                        <CardTitle className="text-xl sm:text-2xl text-foreground font-mono truncate">
                                            {getUserName(session?.user?.name)}
                                        </CardTitle>
                                        <CardDescription className="text-muted-foreground text-sm truncate">
                                            {session?.user?.email}
                                        </CardDescription>
                                        <div className="flex flex-wrap items-center gap-2 mt-2">
                                            <Badge variant={isVerified ? "default" : "destructive"} className="text-xs">
                                                {isVerified ? (
                                                    <>
                                                        <Check className="w-3 h-3 mr-1" />
                                                        Verified
                                                    </>
                                                ) : (
                                                    <>
                                                        <Mail className="w-3 h-3 mr-1" />
                                                        Unverified
                                                    </>
                                                )}
                                            </Badge>
                                            <Badge variant="outline" className="text-xs">
                                                <Calendar className="w-3 h-3 mr-1" />
                                                <span className="hidden sm:inline">Member since </span>2025
                                            </Badge>
                                        </div>
                                    </div>
                                </div>
                                <Button
                                    onClick={() => setIsEditing(!isEditing)}
                                    variant="outline"
                                    className="w-full sm:w-auto"
                                >
                                    {isEditing ? (
                                        <>
                                            <X className="w-4 h-4 mr-2" />
                                            Cancel
                                        </>
                                    ) : (
                                        <>
                                            <Edit2 className="w-4 h-4 mr-2" />
                                            Edit Profile
                                        </>
                                    )}
                                </Button>
                            </div>
                        </CardHeader>
                    </Card>

                    {/* Profile Information */}
                    <Card className="bg-card border-border">
                        <CardHeader>
                            <CardTitle className="text-foreground flex items-center gap-2">
                                <User className="w-5 h-5" />
                                Profile Information
                            </CardTitle>
                            <CardDescription className="text-muted-foreground">
                                Update your personal information and preferences
                            </CardDescription>
                        </CardHeader>
                        <CardContent className="space-y-6">
                            <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 sm:gap-4 sm:gap-6">
                                <div className="space-y-2">
                                    <Label htmlFor="name" className="text-foreground">Display Name</Label>
                                    <Input
                                        id="name"
                                        value={formData.name}
                                        onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                                        disabled={!isEditing}
                                        className={`bg-card border-border text-foreground ${formErrors.name ? 'border-destructive' : ''}`}
                                    />
                                    {formErrors.name && (
                                        <p className="text-destructive text-sm">{formErrors.name}</p>
                                    )}
                                </div>
                                <div className="space-y-2">
                                    <Label htmlFor="email" className="text-foreground">Email Address</Label>
                                    <Input
                                        id="email"
                                        type="email"
                                        value={formData.email}
                                        onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                                        disabled={!isEditing}
                                        className="bg-card border-border text-foreground"
                                    />
                                </div>
                            </div>

                            <div className="space-y-2">
                                <Label htmlFor="bio" className="text-foreground">Bio</Label>
                                <Textarea
                                    id="bio"
                                    value={formData.bio}
                                    onChange={(e) => setFormData({ ...formData, bio: e.target.value })}
                                    disabled={!isEditing}
                                    placeholder="Tell us about yourself..."
                                    className={`bg-card border-border text-foreground ${formErrors.bio ? 'border-destructive' : ''}`}
                                />
                                {formErrors.bio && (
                                    <p className="text-destructive text-sm">{formErrors.bio}</p>
                                )}
                            </div>

                            <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 sm:gap-6">
                                <div className="space-y-2">
                                    <Label htmlFor="website" className="text-foreground flex items-center gap-2">
                                        <Globe className="w-4 h-4" />
                                        Website
                                    </Label>
                                    <Input
                                        id="website"
                                        value={formData.website}
                                        onChange={(e) => setFormData({ ...formData, website: e.target.value })}
                                        disabled={!isEditing}
                                        placeholder="https://yourwebsite.com"
                                        className={`bg-card border-border text-foreground ${formErrors.website ? 'border-destructive' : ''}`}
                                    />
                                    {formErrors.website && (
                                        <p className="text-destructive text-sm">{formErrors.website}</p>
                                    )}
                                </div>
                                <div className="space-y-2">
                                    <Label htmlFor="github" className="text-foreground flex items-center gap-2">
                                        <Github className="w-4 h-4" />
                                        GitHub
                                    </Label>
                                    <Input
                                        id="github"
                                        value={formData.github}
                                        onChange={(e) => setFormData({ ...formData, github: e.target.value })}
                                        disabled={!isEditing}
                                        placeholder="github.com/username"
                                        className={`bg-card border-border text-foreground ${formErrors.github ? 'border-destructive' : ''}`}
                                    />
                                    {formErrors.github && (
                                        <p className="text-destructive text-sm">{formErrors.github}</p>
                                    )}
                                </div>
                            </div>

                            {isEditing && (
                                <div className="flex flex-col sm:flex-row gap-3 sm:gap-4 pt-4">
                                    <Button
                                        onClick={handleSave}
                                        disabled={updateProfileMutation.isPending}
                                        className="w-full sm:w-auto"
                                    >
                                        {updateProfileMutation.isPending ? (
                                            <>
                                                <div className="w-4 h-4 mr-2 animate-spin rounded-full border-2 border-border border-t-primary" />
                                                Saving...
                                            </>
                                        ) : (
                                            <>
                                                <Save className="w-4 h-4 mr-2" />
                                                Save Changes
                                            </>
                                        )}
                                    </Button>
                                    <Button
                                        onClick={handleCancel}
                                        variant="outline"
                                        className="border-border text-foreground hover:bg-primary/10"
                                    >
                                        Cancel
                                    </Button>
                                </div>
                            )}
                        </CardContent>
                    </Card>

                    {/* Security Settings */}
                    <Card className="bg-card border-border">
                        <CardHeader>
                            <CardTitle className="text-foreground flex items-center gap-2">
                                <Shield className="w-5 h-5" />
                                Security Settings
                            </CardTitle>
                            <CardDescription className="text-muted-foreground">
                                Manage your account security and authentication
                            </CardDescription>
                        </CardHeader>
                        <CardContent className="space-y-6">
                            {/* Change Password */}
                            <div className="space-y-4">
                                <div className="flex items-center justify-between">
                                    <div>
                                        <h3 className="text-foreground font-semibold">Change Password</h3>
                                        <p className="text-foreground/60 text-sm">Update your account password</p>
                                    </div>
                                    <Button
                                        onClick={() => setIsEditingPassword(!isEditingPassword)}
                                        variant="outline"
                                        size="sm"
                                        className="border-border text-foreground hover:bg-primary/10"
                                    >
                                        <Key className="w-4 h-4 mr-2" />
                                        Change Password
                                    </Button>
                                </div>

                                {isEditingPassword && (
                                    <div className="space-y-4 p-4 border border-border rounded-lg">
                                        <div className="space-y-2">
                                            <Label htmlFor="currentPassword" className="text-foreground">Current Password</Label>
                                            <div className="relative">
                                                <Input
                                                    id="currentPassword"
                                                    type={showCurrentPassword ? "text" : "password"}
                                                    value={formData.currentPassword}
                                                    onChange={(e) => setFormData({ ...formData, currentPassword: e.target.value })}
                                                    className={`bg-card border-border text-foreground pr-10 ${passwordErrors.currentPassword ? 'border-destructive' : ''}`}
                                                />
                                                <Button
                                                    type="button"
                                                    variant="ghost"
                                                    size="sm"
                                                    className="absolute right-0 top-0 h-full px-3 py-2 hover:bg-transparent"
                                                    onClick={() => setShowCurrentPassword(!showCurrentPassword)}
                                                >
                                                    {showCurrentPassword ? (
                                                        <EyeOff className="h-4 w-4 text-foreground/60" />
                                                    ) : (
                                                        <Eye className="h-4 w-4 text-foreground/60" />
                                                    )}
                                                </Button>
                                            </div>
                                            {passwordErrors.currentPassword && (
                                                <p className="text-destructive text-sm">{passwordErrors.currentPassword}</p>
                                            )}
                                        </div>

                                        <div className="space-y-2">
                                            <Label htmlFor="newPassword" className="text-foreground">New Password</Label>
                                            <div className="relative">
                                                <Input
                                                    id="newPassword"
                                                    type={showNewPassword ? "text" : "password"}
                                                    value={formData.newPassword}
                                                    onChange={(e) => setFormData({ ...formData, newPassword: e.target.value })}
                                                    className={`bg-card border-border text-foreground pr-10 ${passwordErrors.newPassword ? 'border-destructive' : ''}`}
                                                />
                                                <Button
                                                    type="button"
                                                    variant="ghost"
                                                    size="sm"
                                                    className="absolute right-0 top-0 h-full px-3 py-2 hover:bg-transparent"
                                                    onClick={() => setShowNewPassword(!showNewPassword)}
                                                >
                                                    {showNewPassword ? (
                                                        <EyeOff className="h-4 w-4 text-foreground/60" />
                                                    ) : (
                                                        <Eye className="h-4 w-4 text-foreground/60" />
                                                    )}
                                                </Button>
                                            </div>
                                            {passwordErrors.newPassword && (
                                                <p className="text-destructive text-sm">{passwordErrors.newPassword}</p>
                                            )}
                                        </div>

                                        <div className="space-y-2">
                                            <Label htmlFor="confirmPassword" className="text-foreground">Confirm New Password</Label>
                                            <div className="relative">
                                                <Input
                                                    id="confirmPassword"
                                                    type={showConfirmPassword ? "text" : "password"}
                                                    value={formData.confirmPassword}
                                                    onChange={(e) => setFormData({ ...formData, confirmPassword: e.target.value })}
                                                    className={`bg-card border-border text-foreground pr-10 ${passwordErrors.confirmPassword ? 'border-destructive' : ''}`}
                                                />
                                                <Button
                                                    type="button"
                                                    variant="ghost"
                                                    size="sm"
                                                    className="absolute right-0 top-0 h-full px-3 py-2 hover:bg-transparent"
                                                    onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                                                >
                                                    {showConfirmPassword ? (
                                                        <EyeOff className="h-4 w-4 text-foreground/60" />
                                                    ) : (
                                                        <Eye className="h-4 w-4 text-foreground/60" />
                                                    )}
                                                </Button>
                                            </div>
                                            {passwordErrors.confirmPassword && (
                                                <p className="text-destructive text-sm">{passwordErrors.confirmPassword}</p>
                                            )}
                                        </div>

                                        <div className="flex flex-col sm:flex-row gap-3 sm:gap-4">
                                            <Button
                                                onClick={handlePasswordChange}
                                                disabled={updatePasswordMutation.isPending}
                                                className="bg-primary/10 text-foreground hover:bg-primary/20"
                                            >
                                                {updatePasswordMutation.isPending ? (
                                                    <>
                                                        <div className="w-4 h-4 mr-2 animate-spin rounded-full border-2 border-border border-t-primary" />
                                                        Updating...
                                                    </>
                                                ) : (
                                                    <>
                                                        <Save className="w-4 h-4 mr-2" />
                                                        Update Password
                                                    </>
                                                )}
                                            </Button>
                                            <Button
                                                onClick={() => setIsEditingPassword(false)}
                                                variant="outline"
                                                className="border-border text-foreground hover:bg-primary/10"
                                            >
                                                Cancel
                                            </Button>
                                        </div>
                                    </div>
                                )}
                            </div>

                            <Separator className="bg-border" />

                            <Separator className="bg-border" />

                            {/* Connected Accounts */}
                            <div className="space-y-4">
                                <div>
                                    <h3 className="text-foreground font-semibold">Connected Accounts</h3>
                                    <p className="text-foreground/60 text-sm">Manage your social login connections</p>
                                </div>
                                <div className="space-y-2">
                                    {/* Show Email & Password account */}
                                    <div className="flex items-center justify-between p-3 border border-border rounded-lg">
                                        <div className="flex items-center gap-3">
                                            <div className="w-8 h-8 bg-primary/10 rounded-full flex items-center justify-center">
                                                <Mail className="w-4 h-4 text-foreground" />
                                            </div>
                                            <div>
                                                <div className="text-foreground font-medium">Email & Password</div>
                                                <div className="text-foreground/60 text-sm">Primary authentication method</div>
                                            </div>
                                        </div>
                                        <Badge variant="outline" className="border-border text-foreground">
                                            Active
                                        </Badge>
                                    </div>

                                    {/* Show connected OAuth providers */}
                                    {profileData?.accounts?.map((account, index) => (
                                        <div key={index} className="flex items-center justify-between p-3 border border-border rounded-lg">
                                            <div className="flex items-center gap-3">
                                                <div className="w-8 h-8 bg-primary/10 rounded-full flex items-center justify-center">
                                                    {account.provider === 'google' && <Mail className="w-4 h-4 text-foreground" />}
                                                    {account.provider === 'github' && <Github className="w-4 h-4 text-foreground" />}
                                                    {!['google', 'github'].includes(account.provider) && <Shield className="w-4 h-4 text-foreground" />}
                                                </div>
                                                <div>
                                                    <div className="text-foreground font-medium capitalize">
                                                        {account.provider} Account
                                                    </div>
                                                    <div className="text-foreground/60 text-sm">Connected OAuth provider</div>
                                                </div>
                                            </div>
                                            <Badge variant="outline" className="border-border text-foreground">
                                                Connected
                                            </Badge>
                                        </div>
                                    ))}

                                    {(!profileData?.accounts || profileData.accounts.length === 0) && (
                                        <div className="p-4 border border-border rounded-lg text-center">
                                            <p className="text-foreground/60 text-sm">No additional accounts connected</p>
                                            <p className="text-foreground/40 text-xs mt-1">
                                                You can connect social accounts during login
                                            </p>
                                        </div>
                                    )}
                                </div>
                            </div>
                        </CardContent>
                    </Card>

                    {/* Preferences */}
                    <Card className="bg-card border-border">
                        <CardHeader>
                            <CardTitle className="text-foreground flex items-center gap-2">
                                <Settings className="w-5 h-5" />
                                Preferences
                            </CardTitle>
                            <CardDescription className="text-foreground/60">
                                Customize your NOTE_SNAP experience
                            </CardDescription>
                        </CardHeader>
                        <CardContent className="space-y-6">
                            <div className="flex items-center justify-between">
                                <div>
                                    <h3 className="text-foreground font-semibold">Email Notifications</h3>
                                    <p className="text-foreground/60 text-sm">Receive email updates and alerts</p>
                                </div>
                                <div className="flex items-center gap-2">
                                    {updatePreferencesMutation.isPending && (
                                        <div className="w-4 h-4 animate-spin rounded-full border-2 border-border border-t-primary" />
                                    )}
                                    <Switch
                                        checked={preferences.emailNotifications}
                                        onCheckedChange={(checked) => handlePreferenceChange('emailNotifications', checked)}
                                        disabled={updatePreferencesMutation.isPending}
                                    />
                                </div>
                            </div>

                            <Separator className="bg-border" />

                            <div className="flex items-center justify-between">
                                <div>
                                    <h3 className="text-foreground font-semibold">Public Profile</h3>
                                    <p className="text-foreground/60 text-sm">Make your profile visible to other users</p>
                                </div>
                                <div className="flex items-center gap-2">
                                    {updatePreferencesMutation.isPending && (
                                        <div className="w-4 h-4 animate-spin rounded-full border-2 border-border border-t-primary" />
                                    )}
                                    <Switch
                                        checked={preferences.publicProfile}
                                        onCheckedChange={(checked) => handlePreferenceChange('publicProfile', checked)}
                                        disabled={updatePreferencesMutation.isPending}
                                    />
                                </div>
                            </div>

                            <Separator className="bg-border" />

                            <div className="flex items-center justify-between">
                                <div>
                                    <h3 className="text-foreground font-semibold">Share Analytics</h3>
                                    <p className="text-foreground/60 text-sm">Help improve NOTE_SNAP by sharing usage data</p>
                                </div>
                                <div className="flex items-center gap-2">
                                    {updatePreferencesMutation.isPending && (
                                        <div className="w-4 h-4 animate-spin rounded-full border-2 border-border border-t-primary" />
                                    )}
                                    <Switch
                                        checked={preferences.shareAnalytics}
                                        onCheckedChange={(checked) => handlePreferenceChange('shareAnalytics', checked)}
                                        disabled={updatePreferencesMutation.isPending}
                                    />
                                </div>
                            </div>
                        </CardContent>
                    </Card>

                    {/* Danger Zone */}
                    <Card className="bg-card border-destructive/20">
                        <CardHeader>
                            <CardTitle className="text-destructive flex items-center gap-2">
                                <Trash2 className="w-5 h-5" />
                                Danger Zone
                            </CardTitle>
                            <CardDescription className="text-destructive/60">
                                Irreversible and destructive actions
                            </CardDescription>
                        </CardHeader>
                        <CardContent className="space-y-4">
                            <div className="flex items-center justify-between p-4 border border-destructive/20 rounded-lg">
                                <div>
                                    <h3 className="text-destructive font-semibold">Delete Account</h3>
                                    <p className="text-destructive/60 text-sm">
                                        Permanently delete your account and all associated data
                                    </p>
                                </div>
                                <AlertDialog open={showDeleteDialog} onOpenChange={setShowDeleteDialog}>
                                    <AlertDialogTrigger asChild>
                                        <Button
                                            variant="destructive"
                                            className="bg-destructive/10 text-destructive hover:bg-destructive/20 border-destructive"
                                        >
                                            <Trash2 className="w-4 h-4 mr-2" />
                                            Delete Account
                                        </Button>
                                    </AlertDialogTrigger>
                                    <AlertDialogContent className="bg-card border-destructive/20">
                                        <AlertDialogHeader>
                                            <AlertDialogTitle className="text-destructive flex items-center gap-2">
                                                <Trash2 className="w-5 h-5" />
                                                Delete Account Permanently?
                                            </AlertDialogTitle>
                                            <AlertDialogDescription className="text-muted-foreground">
                                                This action cannot be undone. This will permanently delete your account
                                                and remove all your data, notes, summaries, and settings from our servers.
                                                <br /><br />
                                                <strong>Are you absolutely sure you want to continue?</strong>
                                            </AlertDialogDescription>
                                        </AlertDialogHeader>
                                        <AlertDialogFooter>
                                            <AlertDialogCancel>Cancel</AlertDialogCancel>
                                            <AlertDialogAction
                                                onClick={handleDeleteAccount}
                                                className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
                                                disabled={deleteAccountMutation.isPending}
                                            >
                                                {deleteAccountMutation.isPending ? (
                                                    <>
                                                        <div className="w-4 h-4 mr-2 animate-spin rounded-full border-2 border-current border-t-transparent" />
                                                        Deleting...
                                                    </>
                                                ) : (
                                                    <>
                                                        <Trash2 className="w-4 h-4 mr-2" />
                                                        Yes, Delete Account
                                                    </>
                                                )}
                                            </AlertDialogAction>
                                        </AlertDialogFooter>
                                    </AlertDialogContent>
                                </AlertDialog>
                            </div>
                        </CardContent>
                    </Card>
                </div>
            </div>
        </div>
    )
}
