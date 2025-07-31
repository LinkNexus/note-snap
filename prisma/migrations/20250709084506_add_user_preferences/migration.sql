-- AlterTable
ALTER TABLE "users" ADD COLUMN     "email_notifications" BOOLEAN NOT NULL DEFAULT true,
ADD COLUMN     "public_profile" BOOLEAN NOT NULL DEFAULT false,
ADD COLUMN     "share_analytics" BOOLEAN NOT NULL DEFAULT true,
ADD COLUMN     "two_factor_enabled" BOOLEAN NOT NULL DEFAULT false;
