import 'server-only';

import { randomUUID } from 'node:crypto';

import { eq } from 'drizzle-orm';
import { createUploadthing, type FileRouter, UTFiles } from 'uploadthing/next';
import { UploadThingError } from 'uploadthing/server';

import { auth } from '@/lib/auth';
import { db } from '@/lib/db';
import { adminMembership } from '@/lib/db/schema';
import { recordCompletedStorageUpload } from '@/modules/storage/objects';

const upload = createUploadthing();

export const uploadThingRouter = {
  leadershipHeadshot: upload({
    image: {
      maxFileSize: '8MB',
      maxFileCount: 1,
      minFileCount: 1,
    },
  })
    .middleware(async ({ req, files }) => {
      if (!process.env.UPLOADTHING_TOKEN) {
        throw new UploadThingError({
          code: 'MISSING_ENV',
          message: 'Image storage is not configured.',
        });
      }

      const session = await auth.api.getSession({ headers: req.headers });
      if (!session) {
        throw new UploadThingError({
          code: 'FORBIDDEN',
          message: 'Sign in to upload a headshot.',
        });
      }

      const [membership] = await db
        .select({ userId: adminMembership.userId })
        .from(adminMembership)
        .where(eq(adminMembership.userId, session.user.id))
        .limit(1);

      if (!membership) {
        throw new UploadThingError({
          code: 'FORBIDDEN',
          message: 'Admin access is required.',
        });
      }

      for (const file of files) {
        if (!isSupportedHeadshot(file.name, file.type)) {
          throw new UploadThingError({
            code: 'BAD_REQUEST',
            message: 'Use a JPG, PNG, or WebP image.',
          });
        }
      }

      return {
        userId: session.user.id,
        [UTFiles]: files.map((file) => ({
          ...file,
          customId: randomUUID(),
        })),
      };
    })
    .onUploadComplete(async ({ metadata, file }) => {
      const completed = await recordCompletedStorageUpload({
        id: file.customId ?? randomUUID(),
        objectKey: file.key,
        publicUrl: file.ufsUrl,
        originalFilename: file.name,
        mimeType: file.type,
        byteSize: file.size,
        fileHash: file.fileHash,
        endpoint: 'leadershipHeadshot',
        uploadedByUserId: metadata.userId,
      });

      return {
        id: completed.id,
        publicUrl: completed.publicUrl,
      };
    }),
} satisfies FileRouter;

export type UploadThingRouter = typeof uploadThingRouter;

function isSupportedHeadshot(name: string, mimeType: string): boolean {
  const extension = name.split('.').at(-1)?.toLowerCase();
  return (
    ['image/jpeg', 'image/png', 'image/webp'].includes(mimeType.toLowerCase()) &&
    extension !== undefined &&
    ['jpg', 'jpeg', 'png', 'webp'].includes(extension)
  );
}
