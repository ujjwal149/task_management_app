-- Abort rather than merge different existing accounts whose emails differ only in case.
DO $$ BEGIN
  IF EXISTS (SELECT 1 FROM "User" GROUP BY lower(trim(email)) HAVING count(*) > 1) THEN
    RAISE EXCEPTION 'Resolve duplicate case-insensitive user emails before applying this migration';
  END IF;
END $$;
UPDATE "User" SET email = lower(trim(email));
ALTER TABLE "User" ADD COLUMN "emailVerifiedAt" TIMESTAMP(3),
  ADD COLUMN "tokenVersion" INTEGER NOT NULL DEFAULT 0;
-- No backfill: previous registrations, including Google accounts, must prove ownership.
CREATE TYPE "OtpPurpose" AS ENUM ('SIGNUP', 'LOGIN', 'RESET_PASSWORD');
CREATE TABLE "EmailOtp" (
  "id" TEXT NOT NULL PRIMARY KEY,
  "email" TEXT NOT NULL,
  "purpose" "OtpPurpose" NOT NULL,
  "challengeId" TEXT NOT NULL,
  "codeHash" TEXT,
  "name" TEXT,
  "passwordHash" TEXT,
  "expiresAt" TIMESTAMP(3) NOT NULL,
  "attempts" INTEGER NOT NULL DEFAULT 0,
  "lastSentAt" TIMESTAMP(3) NOT NULL,
  "windowStartedAt" TIMESTAMP(3) NOT NULL,
  "sendCount" INTEGER NOT NULL DEFAULT 0
);
CREATE UNIQUE INDEX "EmailOtp_email_purpose_key" ON "EmailOtp"("email", "purpose");
CREATE INDEX "EmailOtp_expiresAt_idx" ON "EmailOtp"("expiresAt");
CREATE TABLE "AuthRateLimit" (
  "key" TEXT NOT NULL PRIMARY KEY,
  "windowStartedAt" TIMESTAMP(3) NOT NULL,
  "count" INTEGER NOT NULL
);
CREATE INDEX "AuthRateLimit_windowStartedAt_idx" ON "AuthRateLimit"("windowStartedAt");
