import {
  pgTable,
  pgEnum,
  text,
  boolean,
  timestamp,
  integer,
  jsonb,
  date,
  time,
  index,
  uniqueIndex,
  check,
  uuid,
} from 'drizzle-orm/pg-core';
import { relations, sql } from 'drizzle-orm';

export const adminRoleEnum = pgEnum('admin_role', ['owner', 'editor']);
export const contentStatusEnum = pgEnum('content_status', [
  'draft',
  'published',
  'archived',
]);
export const eventKindEnum = pgEnum('event_kind', ['single', 'weekly']);

// User table
export const user = pgTable(
  'user',
  {
    id: text('id').primaryKey(),
    name: text('name').notNull(),
    email: text('email').notNull().unique(),
    emailVerified: boolean('emailVerified').notNull().default(false),
    image: text('image'),
    createdAt: timestamp('createdAt').notNull().defaultNow(),
    updatedAt: timestamp('updatedAt').notNull().defaultNow(),
  },
  (table) => [
    uniqueIndex('user_email_idx').on(table.email),
  ]
);

// Session table
export const session = pgTable(
  'session',
  {
    id: text('id').primaryKey(),
    expiresAt: timestamp('expiresAt').notNull(),
    token: text('token').notNull().unique(),
    createdAt: timestamp('createdAt').notNull().defaultNow(),
    updatedAt: timestamp('updatedAt').notNull().defaultNow(),
    ipAddress: text('ipAddress'),
    userAgent: text('userAgent'),
    userId: text('userId')
      .notNull()
      .references(() => user.id, { onDelete: 'cascade' }),
  },
  (table) => [index('session_user_id_idx').on(table.userId)]
);

// Account table
export const account = pgTable(
  'account',
  {
    id: text('id').primaryKey(),
    issuer: text('issuer').notNull(),
    accountId: text('accountId').notNull(),
    providerId: text('providerId').notNull(),
    userId: text('userId')
      .notNull()
      .references(() => user.id, { onDelete: 'cascade' }),
    accessToken: text('accessToken'),
    refreshToken: text('refreshToken'),
    idToken: text('idToken'),
    accessTokenExpiresAt: timestamp('accessTokenExpiresAt'),
    refreshTokenExpiresAt: timestamp('refreshTokenExpiresAt'),
    scope: text('scope'),
    password: text('password'),
    createdAt: timestamp('createdAt').notNull().defaultNow(),
    updatedAt: timestamp('updatedAt').notNull().defaultNow(),
  },
  (table) => [
    uniqueIndex('account_issuer_account_id_uidx').on(
      table.issuer,
      table.accountId,
    ),
    index('account_user_id_idx').on(table.userId),
  ]
);

export const pixelArt = pgTable('pixel_art', {
  id: uuid('id').defaultRandom().primaryKey(),
  title: text('title'),
  description: text('description'),
  rows: integer('rows').notNull(),
  cols: integer('cols').notNull(),
  grid: jsonb('grid').notNull(),
  isPublic: boolean('isPublic').notNull().default(true),
  userId: text('userId').references(() => user.id, { onDelete: 'set null' }),
  createdAt: timestamp('createdAt').notNull().defaultNow(),
  updatedAt: timestamp('updatedAt').notNull().defaultNow(),
});

export const pixelArtRelations = relations(pixelArt, ({ one }) => ({
  creator: one(user, {
    fields: [pixelArt.userId],
    references: [user.id],
  }),
}));

export const adminMembership = pgTable(
  'admin_membership',
  {
    userId: text('userId')
      .primaryKey()
      .references(() => user.id, { onDelete: 'cascade' }),
    role: adminRoleEnum('role').notNull().default('editor'),
    invitedByUserId: text('invitedByUserId').references(() => user.id, {
      onDelete: 'set null',
    }),
    createdAt: timestamp('createdAt').notNull().defaultNow(),
    updatedAt: timestamp('updatedAt').notNull().defaultNow(),
  },
  (table) => [index('admin_membership_role_idx').on(table.role)],
);

export const adminInvitation = pgTable(
  'admin_invitation',
  {
    id: uuid('id').defaultRandom().primaryKey(),
    email: text('email').notNull(),
    role: adminRoleEnum('role').notNull().default('editor'),
    tokenHash: text('tokenHash').notNull(),
    invitedByUserId: text('invitedByUserId').references(() => user.id, {
      onDelete: 'set null',
    }),
    acceptedByUserId: text('acceptedByUserId').references(() => user.id, {
      onDelete: 'set null',
    }),
    acceptedAt: timestamp('acceptedAt'),
    revokedAt: timestamp('revokedAt'),
    expiresAt: timestamp('expiresAt').notNull(),
    lastSentAt: timestamp('lastSentAt').notNull().defaultNow(),
    createdAt: timestamp('createdAt').notNull().defaultNow(),
    updatedAt: timestamp('updatedAt').notNull().defaultNow(),
  },
  (table) => [
    uniqueIndex('admin_invitation_token_hash_uidx').on(table.tokenHash),
    index('admin_invitation_email_idx').on(table.email),
    index('admin_invitation_expires_at_idx').on(table.expiresAt),
    index('admin_invitation_invited_by_idx').on(table.invitedByUserId),
  ],
);

export const auditLog = pgTable(
  'audit_log',
  {
    id: integer('id').primaryKey().generatedAlwaysAsIdentity(),
    actorUserId: text('actorUserId').references(() => user.id, {
      onDelete: 'set null',
    }),
    action: text('action').notNull(),
    entityType: text('entityType').notNull(),
    entityId: text('entityId'),
    summary: text('summary').notNull(),
    metadata: jsonb('metadata').$type<Record<string, unknown>>(),
    createdAt: timestamp('createdAt').notNull().defaultNow(),
  },
  (table) => [
    index('audit_log_created_at_idx').on(table.createdAt),
    index('audit_log_actor_user_id_idx').on(table.actorUserId),
    index('audit_log_entity_idx').on(table.entityType, table.entityId),
  ],
);

export const contentEvent = pgTable(
  'content_event',
  {
    id: integer('id').primaryKey().generatedAlwaysAsIdentity(),
    title: text('title').notNull(),
    description: text('description').notNull(),
    kind: eventKindEnum('kind').notNull().default('single'),
    status: contentStatusEnum('status').notNull().default('draft'),
    date: date('date'),
    startDate: date('startDate'),
    endDate: date('endDate'),
    dayOfWeek: integer('dayOfWeek'),
    startTime: time('startTime').notNull(),
    endTime: time('endTime').notNull(),
    timeZone: text('timeZone').notNull().default('America/Chicago'),
    location: text('location').notNull(),
    registrationUrl: text('registrationUrl'),
    tags: jsonb('tags').$type<string[]>().notNull().default([]),
    isFeatured: boolean('isFeatured').notNull().default(false),
    sortOrder: integer('sortOrder').notNull().default(0),
    createdByUserId: text('createdByUserId').references(() => user.id, {
      onDelete: 'set null',
    }),
    updatedByUserId: text('updatedByUserId').references(() => user.id, {
      onDelete: 'set null',
    }),
    createdAt: timestamp('createdAt').notNull().defaultNow(),
    updatedAt: timestamp('updatedAt').notNull().defaultNow(),
  },
  (table) => [
    index('content_event_status_idx').on(table.status),
    index('content_event_date_idx').on(table.date),
    index('content_event_start_date_idx').on(table.startDate),
    check(
      'content_event_time_range_check',
      sql`${table.endTime} > ${table.startTime}`,
    ),
    check(
      'content_event_weekly_schedule_check',
      sql`${table.kind} = 'single' OR (${table.startDate} IS NOT NULL AND ${table.endDate} IS NOT NULL AND ${table.dayOfWeek} BETWEEN 0 AND 6 AND ${table.endDate} >= ${table.startDate})`,
    ),
    check(
      'content_event_weekly_day_check',
      sql`${table.kind} = 'single' OR (EXTRACT(DOW FROM ${table.startDate})::integer = ${table.dayOfWeek} AND EXTRACT(DOW FROM ${table.endDate})::integer = ${table.dayOfWeek})`,
    ),
  ],
);

export const verification = pgTable(
  'verification',
  {
    id: text('id').primaryKey(),
    identifier: text('identifier').notNull(),
    value: text('value').notNull(),
    expiresAt: timestamp('expiresAt').notNull(),
    createdAt: timestamp('createdAt').notNull().defaultNow(),
    updatedAt: timestamp('updatedAt').notNull().defaultNow(),
  },
  (table) => [index('verification_identifier_idx').on(table.identifier)],
);

// Relations
export const userRelations = relations(user, ({ many }) => ({
  sessions: many(session),
  accounts: many(account),
  pixelArt: many(pixelArt),
}));

export const adminMembershipRelations = relations(
  adminMembership,
  ({ one }) => ({
    user: one(user, {
      fields: [adminMembership.userId],
      references: [user.id],
    }),
  }),
);

export const sessionRelations = relations(session, ({ one }) => ({
  user: one(user, {
    fields: [session.userId],
    references: [user.id],
  }),
}));

export const accountRelations = relations(account, ({ one }) => ({
  user: one(user, {
    fields: [account.userId],
    references: [user.id],
  }),
}));

// Type exports
export type User = typeof user.$inferSelect;
export type NewUser = typeof user.$inferInsert;

export type Session = typeof session.$inferSelect;
export type NewSession = typeof session.$inferInsert;

export type Account = typeof account.$inferSelect;
export type NewAccount = typeof account.$inferInsert;

export type Verification = typeof verification.$inferSelect;
export type NewVerification = typeof verification.$inferInsert;

export type PixelArt = typeof pixelArt.$inferSelect;
export type NewPixelArt = typeof pixelArt.$inferInsert;

export type AdminMembership = typeof adminMembership.$inferSelect;
export type AdminInvitation = typeof adminInvitation.$inferSelect;
export type AuditLog = typeof auditLog.$inferSelect;
export type ContentEvent = typeof contentEvent.$inferSelect;
export type NewContentEvent = typeof contentEvent.$inferInsert;
