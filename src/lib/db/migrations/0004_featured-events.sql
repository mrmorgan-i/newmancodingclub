ALTER TABLE "content_event" ADD COLUMN "isFeatured" boolean DEFAULT false NOT NULL;--> statement-breakpoint
UPDATE "content_event"
SET "isFeatured" = true
WHERE "title" = 'Casual Coding' AND "kind" = 'weekly';
