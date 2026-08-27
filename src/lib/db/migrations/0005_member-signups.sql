CREATE TABLE "club_member" (
	"id" integer PRIMARY KEY GENERATED ALWAYS AS IDENTITY (sequence name "club_member_id_seq" INCREMENT BY 1 MINVALUE 1 MAXVALUE 2147483647 START WITH 1 CACHE 1),
	"name" text NOT NULL,
	"email" text NOT NULL,
	"phone" text NOT NULL,
	"major" text DEFAULT 'Not specified' NOT NULL,
	"welcomeEmailSentAt" timestamp,
	"lastEmailAttemptAt" timestamp,
	"lastEmailError" text,
	"joinedAt" timestamp DEFAULT now() NOT NULL,
	"lastJoinedAt" timestamp DEFAULT now() NOT NULL,
	"updatedAt" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE UNIQUE INDEX "club_member_email_uidx" ON "club_member" USING btree ("email");--> statement-breakpoint
CREATE INDEX "club_member_last_joined_at_idx" ON "club_member" USING btree ("lastJoinedAt");