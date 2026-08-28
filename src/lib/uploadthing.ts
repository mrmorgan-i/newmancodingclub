import { genUploader } from 'uploadthing/client';
import { z } from 'zod';

import type { UploadThingRouter } from '@/modules/storage/uploadthing/router';

const uploadedHeadshotSchema = z.object({
  id: z.string().uuid(),
  publicUrl: z.url(),
});

export type UploadedHeadshot = z.infer<typeof uploadedHeadshotSchema>;

const uploader = genUploader<UploadThingRouter>({
  url: '/api/uploadthing',
});

export async function uploadLeadershipHeadshot({
  file,
  onProgress,
}: {
  file: File;
  onProgress?: (progress: number) => void;
}): Promise<UploadedHeadshot> {
  const uploads = await uploader.uploadFiles('leadershipHeadshot', {
    files: [file],
    onUploadProgress({ progress }) {
      onProgress?.(progress);
    },
  });
  const uploaded = uploads[0];

  if (!uploaded) throw new Error('The upload did not return an image.');
  return uploadedHeadshotSchema.parse(uploaded.serverData);
}
