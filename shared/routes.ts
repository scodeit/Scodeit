
import { z } from 'zod';

export const api = {
  status: {
    get: {
      method: 'GET' as const,
      path: '/api/status',
      responses: {
        200: z.object({ status: z.string() }),
      },
    },
  },
};
