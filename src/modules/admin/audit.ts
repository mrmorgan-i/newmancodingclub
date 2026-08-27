import 'server-only';

import { db } from '@/lib/db';
import { auditLog } from '@/lib/db/schema';

interface WriteAuditLogInput {
  actorUserId: string | null;
  action: string;
  entityType: string;
  entityId?: string | number | null;
  summary: string;
  metadata?: Record<string, unknown>;
}

export async function writeAuditLog({
  actorUserId,
  action,
  entityType,
  entityId,
  summary,
  metadata,
}: WriteAuditLogInput): Promise<void> {
  await db.insert(auditLog).values({
    actorUserId,
    action,
    entityType,
    entityId: entityId === null || entityId === undefined ? null : String(entityId),
    summary,
    metadata: metadata ?? null,
  });
}
