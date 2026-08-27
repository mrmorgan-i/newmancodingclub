CREATE TYPE "public"."admin_role" AS ENUM('owner', 'editor');--> statement-breakpoint
CREATE TYPE "public"."content_status" AS ENUM('draft', 'published', 'archived');--> statement-breakpoint
CREATE TYPE "public"."event_kind" AS ENUM('single', 'weekly');--> statement-breakpoint
CREATE TABLE "admin_invitation" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"email" text NOT NULL,
	"role" "admin_role" DEFAULT 'editor' NOT NULL,
	"tokenHash" text NOT NULL,
	"invitedByUserId" text,
	"acceptedByUserId" text,
	"acceptedAt" timestamp,
	"revokedAt" timestamp,
	"expiresAt" timestamp NOT NULL,
	"lastSentAt" timestamp DEFAULT now() NOT NULL,
	"createdAt" timestamp DEFAULT now() NOT NULL,
	"updatedAt" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "admin_membership" (
	"userId" text PRIMARY KEY NOT NULL,
	"role" "admin_role" DEFAULT 'editor' NOT NULL,
	"invitedByUserId" text,
	"createdAt" timestamp DEFAULT now() NOT NULL,
	"updatedAt" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "audit_log" (
	"id" integer PRIMARY KEY GENERATED ALWAYS AS IDENTITY (sequence name "audit_log_id_seq" INCREMENT BY 1 MINVALUE 1 MAXVALUE 2147483647 START WITH 1 CACHE 1),
	"actorUserId" text,
	"action" text NOT NULL,
	"entityType" text NOT NULL,
	"entityId" text,
	"summary" text NOT NULL,
	"metadata" jsonb,
	"createdAt" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "content_event" (
	"id" integer PRIMARY KEY GENERATED ALWAYS AS IDENTITY (sequence name "content_event_id_seq" INCREMENT BY 1 MINVALUE 1 MAXVALUE 2147483647 START WITH 1 CACHE 1),
	"title" text NOT NULL,
	"description" text NOT NULL,
	"kind" "event_kind" DEFAULT 'single' NOT NULL,
	"status" "content_status" DEFAULT 'draft' NOT NULL,
	"date" date,
	"startDate" date,
	"endDate" date,
	"dayOfWeek" integer,
	"startTime" time NOT NULL,
	"endTime" time NOT NULL,
	"timeZone" text DEFAULT 'America/Chicago' NOT NULL,
	"location" text NOT NULL,
	"registrationUrl" text,
	"tags" jsonb DEFAULT '[]'::jsonb NOT NULL,
	"sortOrder" integer DEFAULT 0 NOT NULL,
	"createdByUserId" text,
	"updatedByUserId" text,
	"createdAt" timestamp DEFAULT now() NOT NULL,
	"updatedAt" timestamp DEFAULT now() NOT NULL,
	CONSTRAINT "content_event_time_range_check" CHECK ("content_event"."endTime" > "content_event"."startTime"),
	CONSTRAINT "content_event_weekly_schedule_check" CHECK ("content_event"."kind" = 'single' OR ("content_event"."startDate" IS NOT NULL AND "content_event"."endDate" IS NOT NULL AND "content_event"."dayOfWeek" BETWEEN 0 AND 6 AND "content_event"."endDate" >= "content_event"."startDate"))
);
--> statement-breakpoint
ALTER TABLE "admin_invitation" ADD CONSTRAINT "admin_invitation_invitedByUserId_user_id_fk" FOREIGN KEY ("invitedByUserId") REFERENCES "public"."user"("id") ON DELETE set null ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "admin_invitation" ADD CONSTRAINT "admin_invitation_acceptedByUserId_user_id_fk" FOREIGN KEY ("acceptedByUserId") REFERENCES "public"."user"("id") ON DELETE set null ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "admin_membership" ADD CONSTRAINT "admin_membership_userId_user_id_fk" FOREIGN KEY ("userId") REFERENCES "public"."user"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "admin_membership" ADD CONSTRAINT "admin_membership_invitedByUserId_user_id_fk" FOREIGN KEY ("invitedByUserId") REFERENCES "public"."user"("id") ON DELETE set null ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "audit_log" ADD CONSTRAINT "audit_log_actorUserId_user_id_fk" FOREIGN KEY ("actorUserId") REFERENCES "public"."user"("id") ON DELETE set null ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "content_event" ADD CONSTRAINT "content_event_createdByUserId_user_id_fk" FOREIGN KEY ("createdByUserId") REFERENCES "public"."user"("id") ON DELETE set null ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "content_event" ADD CONSTRAINT "content_event_updatedByUserId_user_id_fk" FOREIGN KEY ("updatedByUserId") REFERENCES "public"."user"("id") ON DELETE set null ON UPDATE no action;--> statement-breakpoint
CREATE UNIQUE INDEX "admin_invitation_token_hash_uidx" ON "admin_invitation" USING btree ("tokenHash");--> statement-breakpoint
CREATE INDEX "admin_invitation_email_idx" ON "admin_invitation" USING btree ("email");--> statement-breakpoint
CREATE INDEX "admin_invitation_expires_at_idx" ON "admin_invitation" USING btree ("expiresAt");--> statement-breakpoint
CREATE INDEX "admin_invitation_invited_by_idx" ON "admin_invitation" USING btree ("invitedByUserId");--> statement-breakpoint
CREATE INDEX "admin_membership_role_idx" ON "admin_membership" USING btree ("role");--> statement-breakpoint
CREATE INDEX "audit_log_created_at_idx" ON "audit_log" USING btree ("createdAt");--> statement-breakpoint
CREATE INDEX "audit_log_actor_user_id_idx" ON "audit_log" USING btree ("actorUserId");--> statement-breakpoint
CREATE INDEX "audit_log_entity_idx" ON "audit_log" USING btree ("entityType","entityId");--> statement-breakpoint
CREATE INDEX "content_event_status_idx" ON "content_event" USING btree ("status");--> statement-breakpoint
CREATE INDEX "content_event_date_idx" ON "content_event" USING btree ("date");--> statement-breakpoint
CREATE INDEX "content_event_start_date_idx" ON "content_event" USING btree ("startDate");--> statement-breakpoint
INSERT INTO "content_event" (
	"title",
	"description",
	"kind",
	"status",
	"date",
	"startDate",
	"endDate",
	"dayOfWeek",
	"startTime",
	"endTime",
	"timeZone",
	"location",
	"registrationUrl",
	"tags",
	"sortOrder"
)
VALUES
	(
		'Casual Coding',
		'Casual coding session where members can work on their own projects or learn new skills.',
		'weekly',
		'published',
		NULL,
		'2026-08-27',
		'2026-12-03',
		4,
		'19:00',
		'20:00',
		'America/Chicago',
		'Library Learning Commons',
		NULL,
		'["Coding", "Social", "Collaboration", "Projects"]'::jsonb,
		0
	),
	(
		'Honors x Coding Club Crossover',
		'Learn how to leverage the latest AI technologies.',
		'single',
		'published',
		'2025-11-20',
		NULL,
		NULL,
		NULL,
		'17:00',
		'18:30',
		'America/Chicago',
		'Library CTL',
		'https://forms.office.com/r/F0Xmpnav3A',
		'["AI", "Prompting", "Hacks"]'::jsonb,
		1
	),
	(
		'Guest Speaker Appearance',
		'Join us for a guest speaker appearance!',
		'single',
		'published',
		NULL,
		NULL,
		NULL,
		NULL,
		'12:00',
		'13:00',
		'America/Chicago',
		'BSGC 104',
		NULL,
		'["Guest Speaker"]'::jsonb,
		2
	);
