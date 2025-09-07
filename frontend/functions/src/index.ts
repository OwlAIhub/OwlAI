import { Request, Response } from 'express';
import { setGlobalOptions } from 'firebase-functions/v2';
import { onRequest } from 'firebase-functions/v2/https';
import next from 'next';
import path from 'path';

// Set global options for all functions
setGlobalOptions({
  maxInstances: 10,
  memory: '1GiB',
  timeoutSeconds: 60,
  region: 'us-central1',
});

// Initialize Next.js app
const nextApp = next({
  dev: false,
  conf: {
    distDir: path.join(__dirname, '../../../.next'),
    experimental: {
      serverComponentsExternalPackages: ['firebase-admin'],
    },
  },
});

const nextjsHandler = nextApp.getRequestHandler();

// Export the Next.js app as a Cloud Function
export const nextjsFunc = onRequest(
  {
    region: 'us-central1',
    memory: '1GiB',
    timeoutSeconds: 60,
    maxInstances: 10,
  },
  async (req: Request, res: Response) => {
    return nextApp.prepare().then(() => {
      return nextjsHandler(req, res);
    });
  }
);
