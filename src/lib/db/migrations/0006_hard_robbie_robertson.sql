CREATE TYPE "public"."leadership_kind" AS ENUM('officer', 'advisor');--> statement-breakpoint
CREATE TABLE "leadership_member" (
	"id" integer PRIMARY KEY GENERATED ALWAYS AS IDENTITY (sequence name "leadership_member_id_seq" INCREMENT BY 1 MINVALUE 1 MAXVALUE 2147483647 START WITH 1 CACHE 1),
	"name" text NOT NULL,
	"role" text NOT NULL,
	"kind" "leadership_kind" DEFAULT 'officer' NOT NULL,
	"bio" text NOT NULL,
	"email" text,
	"imageId" uuid,
	"status" "content_status" DEFAULT 'draft' NOT NULL,
	"sortOrder" integer DEFAULT 0 NOT NULL,
	"termStart" date,
	"termEnd" date,
	"createdByUserId" text,
	"updatedByUserId" text,
	"createdAt" timestamp DEFAULT now() NOT NULL,
	"updatedAt" timestamp DEFAULT now() NOT NULL,
	CONSTRAINT "leadership_member_term_range_check" CHECK ("leadership_member"."termStart" IS NULL OR "leadership_member"."termEnd" IS NULL OR "leadership_member"."termEnd" >= "leadership_member"."termStart")
);
--> statement-breakpoint
CREATE TABLE "storage_object" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"objectKey" text NOT NULL,
	"publicUrl" text NOT NULL,
	"originalFilename" text NOT NULL,
	"mimeType" text NOT NULL,
	"byteSize" integer NOT NULL,
	"fileHash" text,
	"endpoint" text NOT NULL,
	"uploadedByUserId" text,
	"completedAt" timestamp DEFAULT now() NOT NULL,
	"deletedAt" timestamp,
	"createdAt" timestamp DEFAULT now() NOT NULL,
	"updatedAt" timestamp DEFAULT now() NOT NULL,
	CONSTRAINT "storage_object_byte_size_check" CHECK ("storage_object"."byteSize" >= 0)
);
--> statement-breakpoint
ALTER TABLE "content_event" DROP CONSTRAINT "content_event_weekly_day_check";--> statement-breakpoint
ALTER TABLE "content_event" DROP CONSTRAINT "content_event_weekly_schedule_check";--> statement-breakpoint
ALTER TABLE "content_event" ADD COLUMN "repeatInterval" integer DEFAULT 1 NOT NULL;--> statement-breakpoint
ALTER TABLE "content_event" ADD COLUMN "daysOfWeek" jsonb DEFAULT '[]'::jsonb NOT NULL;--> statement-breakpoint
UPDATE "content_event"
SET "daysOfWeek" = jsonb_build_array("dayOfWeek")
WHERE "kind" = 'weekly' AND "dayOfWeek" IS NOT NULL;--> statement-breakpoint
UPDATE "content_event"
SET "repeatInterval" = 2
WHERE "title" = 'Casual Coding' AND "kind" = 'weekly';--> statement-breakpoint
ALTER TABLE "leadership_member" ADD CONSTRAINT "leadership_member_imageId_storage_object_id_fk" FOREIGN KEY ("imageId") REFERENCES "public"."storage_object"("id") ON DELETE set null ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "leadership_member" ADD CONSTRAINT "leadership_member_createdByUserId_user_id_fk" FOREIGN KEY ("createdByUserId") REFERENCES "public"."user"("id") ON DELETE set null ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "leadership_member" ADD CONSTRAINT "leadership_member_updatedByUserId_user_id_fk" FOREIGN KEY ("updatedByUserId") REFERENCES "public"."user"("id") ON DELETE set null ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "storage_object" ADD CONSTRAINT "storage_object_uploadedByUserId_user_id_fk" FOREIGN KEY ("uploadedByUserId") REFERENCES "public"."user"("id") ON DELETE set null ON UPDATE no action;--> statement-breakpoint
CREATE INDEX "leadership_member_status_kind_idx" ON "leadership_member" USING btree ("status","kind");--> statement-breakpoint
CREATE INDEX "leadership_member_sort_order_idx" ON "leadership_member" USING btree ("sortOrder");--> statement-breakpoint
CREATE UNIQUE INDEX "storage_object_object_key_uidx" ON "storage_object" USING btree ("objectKey");--> statement-breakpoint
CREATE INDEX "storage_object_uploaded_by_idx" ON "storage_object" USING btree ("uploadedByUserId");--> statement-breakpoint
CREATE INDEX "storage_object_endpoint_idx" ON "storage_object" USING btree ("endpoint");--> statement-breakpoint
ALTER TABLE "content_event" DROP COLUMN "dayOfWeek";--> statement-breakpoint
ALTER TABLE "content_event" ADD CONSTRAINT "content_event_weekly_schedule_check" CHECK ("content_event"."kind" = 'single' OR ("content_event"."startDate" IS NOT NULL AND "content_event"."endDate" IS NOT NULL AND "content_event"."endDate" >= "content_event"."startDate" AND "content_event"."repeatInterval" BETWEEN 1 AND 52 AND jsonb_typeof("content_event"."daysOfWeek") = 'array' AND jsonb_array_length("content_event"."daysOfWeek") BETWEEN 1 AND 7 AND "content_event"."daysOfWeek" <@ '[0, 1, 2, 3, 4, 5, 6]'::jsonb));--> statement-breakpoint
INSERT INTO "storage_object" (
	"id", "objectKey", "publicUrl", "originalFilename", "mimeType", "byteSize", "fileHash", "endpoint"
) VALUES
	('fc7f6523-badf-4ccc-82c9-8bc7fd101ff9', 'pfb6fEZdNlFMNeOsUw4BdjqACxEO7pSZcs31h6mfIHvR2i5n', 'https://73inbdyp68.ufs.sh/f/pfb6fEZdNlFMNeOsUw4BdjqACxEO7pSZcs31h6mfIHvR2i5n', 'president.JPG', 'image/jpeg', 144984, '331b2a7f0f860fdaa9dde8a86f732637', 'leadershipHeadshot'),
	('64c62992-17da-4817-a742-22ee4e2c4e94', 'pfb6fEZdNlFMNfmfws4BdjqACxEO7pSZcs31h6mfIHvR2i5n', 'https://73inbdyp68.ufs.sh/f/pfb6fEZdNlFMNfmfws4BdjqACxEO7pSZcs31h6mfIHvR2i5n', 'vp.jpg', 'image/jpeg', 7355891, '209eaf22d77ad1fe69d03351b20c94b2', 'leadershipHeadshot'),
	('26a2c784-a83f-4015-ab59-e9e15812e63a', 'pfb6fEZdNlFMfuTXxDg5Ggeq1taFUyIm5NkDzYun3dJ6xXsp', 'https://73inbdyp68.ufs.sh/f/pfb6fEZdNlFMfuTXxDg5Ggeq1taFUyIm5NkDzYun3dJ6xXsp', 'secretary.jpg', 'image/jpeg', 95457, 'f55a0d91a13c11cf81a9f7042f3abb0b', 'leadershipHeadshot'),
	('39079ea5-6a01-4c7d-b8d8-7504fa74b4d5', 'pfb6fEZdNlFM92Z7q1CCMmWh1BNsoi3dIw76fpZFKgyQYVnU', 'https://73inbdyp68.ufs.sh/f/pfb6fEZdNlFM92Z7q1CCMmWh1BNsoi3dIw76fpZFKgyQYVnU', 'treasurer.jpg', 'image/jpeg', 68375, '31bffc700bde32b376dfe8146bbc5e6f', 'leadershipHeadshot'),
	('adc7d4f6-72d1-4a11-93b7-1b6a7606fdb3', 'pfb6fEZdNlFM5qoChJTgKwOYPXAT13dE0tCrUJDuWNv49z8l', 'https://73inbdyp68.ufs.sh/f/pfb6fEZdNlFM5qoChJTgKwOYPXAT13dE0tCrUJDuWNv49z8l', 'events.jpg', 'image/jpeg', 1929261, '154d88633e59348210e03e5373b69895', 'leadershipHeadshot'),
	('c82b2fc7-2fd4-4a1b-ba45-0fb06a004a38', 'pfb6fEZdNlFM0EqQGerokiqprDJOIASaCyRzv7N0H6G1jPTM', 'https://73inbdyp68.ufs.sh/f/pfb6fEZdNlFM0EqQGerokiqprDJOIASaCyRzv7N0H6G1jPTM', 'advisor.jpg', 'image/jpeg', 1332404, 'aabf8000eee4ace9dfacde750e77a8c7', 'leadershipHeadshot'),
	('0d22b646-f907-444b-a1a2-4605633a4b87', 'pfb6fEZdNlFMFdfa5NKNP6iXtlSEq10IzQJZgLbyOn8wmHWT', 'https://73inbdyp68.ufs.sh/f/pfb6fEZdNlFMFdfa5NKNP6iXtlSEq10IzQJZgLbyOn8wmHWT', 'advisor2.jpg', 'image/jpeg', 39777, '80abbaa2f6a0aeab807a24eb008ef3d3', 'leadershipHeadshot');--> statement-breakpoint
INSERT INTO "leadership_member" (
	"name", "role", "kind", "bio", "email", "imageId", "status", "sortOrder"
) VALUES
	('Kelly Lotsu-Morgan', 'President', 'officer', 'Computer Science major with a passion for software development and teaching others how to code.', 'owner@mrimorgan.com', 'fc7f6523-badf-4ccc-82c9-8bc7fd101ff9', 'published', 0),
	('Thatcher McClure', 'Vice President', 'officer', 'Computer Science major with experience in game development.', 'thatchermcclure@gmail.com', '64c62992-17da-4817-a742-22ee4e2c4e94', 'published', 1),
	('Ariana Sweitzer', 'Secretary', 'officer', 'Biology Pre-Vet major with a passion for combining computer science and the medical field.', 'sweitzer602155@newmanu.edu', '26a2c784-a83f-4015-ab59-e9e15812e63a', 'published', 2),
	('David Michaud', 'Treasurer', 'officer', 'Computer Science major with a passion for AI and machine learning.', 'michaud671468@newmanu.edu', '39079ea5-6a01-4c7d-b8d8-7504fa74b4d5', 'published', 3),
	('Gabe Gorcos', 'Events Coordinator', 'officer', 'Biology major eager to leverage coding skills to streamline processes and improve efficiency.', 'gorcos658018@newmanu.edu', 'adc7d4f6-72d1-4a11-93b7-1b6a7606fdb3', 'published', 4),
	('Dr. Robert Norman', 'Advisor', 'advisor', 'Professor of Computer Science at Newman University.', 'normanr@newmanu.edu', 'c82b2fc7-2fd4-4a1b-ba45-0fb06a004a38', 'published', 0),
	('Dr. David Cochran', 'Advisor', 'advisor', 'Dean of the School of Business & Technology.', 'cochrand@newmanu.edu', '0d22b646-f907-444b-a1a2-4605633a4b87', 'published', 1);
