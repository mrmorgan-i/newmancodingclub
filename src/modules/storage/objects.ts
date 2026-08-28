import 'server-only';

import { and, eq, isNull } from 'drizzle-orm';
import { UTApi } from 'uploadthing/server';

import { db } from '@/lib/db';
import { leadershipMember, storageObject } from '@/lib/db/schema';

export interface CompletedStorageUpload {
  id: string;
  objectKey: string;
  publicUrl: string;
  originalFilename: string;
  mimeType: string;
  byteSize: number;
  fileHash: string | null;
  endpoint: 'leadershipHeadshot';
  uploadedByUserId: string | null;
}

export async function recordCompletedStorageUpload(
  upload: CompletedStorageUpload,
): Promise<CompletedStorageUpload> {
  await db.insert(storageObject).values({
    id: upload.id,
    objectKey: upload.objectKey,
    publicUrl: upload.publicUrl,
    originalFilename: upload.originalFilename,
    mimeType: upload.mimeType,
    byteSize: upload.byteSize,
    fileHash: upload.fileHash,
    endpoint: upload.endpoint,
    uploadedByUserId: upload.uploadedByUserId,
  });

  return upload;
}

export async function deleteUnusedStorageObject(id: string): Promise<void> {
  const [reference] = await db
    .select({ id: leadershipMember.id })
    .from(leadershipMember)
    .where(eq(leadershipMember.imageId, id))
    .limit(1);

  if (reference) return;

  const [object] = await db
    .select({ objectKey: storageObject.objectKey })
    .from(storageObject)
    .where(
      eq(storageObject.id, id),
    )
    .limit(1);

  if (!object || !process.env.UPLOADTHING_TOKEN) return;

  const result = await new UTApi({ token: process.env.UPLOADTHING_TOKEN }).deleteFiles(
    object.objectKey,
  );

  if (!result.success) return;

  await db
    .update(storageObject)
    .set({ deletedAt: new Date(), updatedAt: new Date() })
    .where(eq(storageObject.id, id));
}

export async function getActiveStorageObject(id: string) {
  const [object] = await db
    .select({
      id: storageObject.id,
      endpoint: storageObject.endpoint,
      publicUrl: storageObject.publicUrl,
    })
    .from(storageObject)
    .where(and(eq(storageObject.id, id), isNull(storageObject.deletedAt)))
    .limit(1);

  return object ?? null;
}
