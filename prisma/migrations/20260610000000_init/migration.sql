-- CreateSchema
CREATE SCHEMA IF NOT EXISTS "public";

-- CreateEnum
CREATE TYPE "ProposalDeliveryStatus" AS ENUM ('PENDING', 'SENT', 'FAILED');

-- CreateEnum
CREATE TYPE "InquiryType" AS ENUM ('EDUCATION', 'RECREATION', 'GRADUATION', 'CORPORATE');

-- CreateEnum
CREATE TYPE "InquiryStatus" AS ENUM ('PENDING', 'NOTIFIED', 'NOTIFICATION_FAILED');

-- CreateTable
CREATE TABLE "Lead" (
    "id" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "consentedAt" TIMESTAMP(3) NOT NULL,
    "source" TEXT NOT NULL DEFAULT 'website',
    "deliveryStatus" "ProposalDeliveryStatus" NOT NULL DEFAULT 'PENDING',
    "proposalSentAt" TIMESTAMP(3),
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "Lead_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Inquiry" (
    "id" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "message" VARCHAR(2000) NOT NULL,
    "type" "InquiryType" NOT NULL,
    "consentedAt" TIMESTAMP(3) NOT NULL,
    "status" "InquiryStatus" NOT NULL DEFAULT 'PENDING',
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "Inquiry_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "LeadRateLimit" (
    "key" TEXT NOT NULL,
    "requestCount" INTEGER NOT NULL,
    "windowStartedAt" TIMESTAMP(3) NOT NULL,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "LeadRateLimit_pkey" PRIMARY KEY ("key")
);

-- CreateIndex
CREATE INDEX "Lead_email_createdAt_idx" ON "Lead"("email", "createdAt");

-- CreateIndex
CREATE INDEX "Lead_deliveryStatus_createdAt_idx" ON "Lead"("deliveryStatus", "createdAt");

-- CreateIndex
CREATE INDEX "Inquiry_email_createdAt_idx" ON "Inquiry"("email", "createdAt");

-- CreateIndex
CREATE INDEX "Inquiry_status_createdAt_idx" ON "Inquiry"("status", "createdAt");

-- CreateIndex
CREATE INDEX "LeadRateLimit_windowStartedAt_idx" ON "LeadRateLimit"("windowStartedAt");
