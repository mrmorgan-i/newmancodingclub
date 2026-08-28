import { createRouteHandler } from 'uploadthing/next';

import { uploadThingRouter } from '@/modules/storage/uploadthing/router';

export const { GET, POST } = createRouteHandler({
  router: uploadThingRouter,
});
