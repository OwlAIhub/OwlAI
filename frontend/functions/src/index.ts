import { Request, Response } from 'express';
import { setGlobalOptions } from 'firebase-functions/v2';
import { onRequest } from 'firebase-functions/v2/https';
import next from 'next';
import path from 'path';
import { config, log, validateConfiguration } from './config';

// Validate configuration on startup
if (!validateConfiguration()) {
  throw new Error('Firebase Functions configuration validation failed');
}

// Log startup information
log.info('Firebase Functions starting up', {
  environment: config.environment,
  appUrl: config.appUrl,
  features: config.features,
});

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
    distDir: path.join(__dirname, '../../.next'),
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
    // Log request in development
    if (config.features.debug) {
      log.info('Request received', {
        method: req.method,
        url: req.url,
        userAgent: req.get('User-Agent'),
      });
    }

    return nextApp
      .prepare()
      .then(() => {
        return nextjsHandler(req, res);
      })
      .catch(error => {
        log.error('Next.js handler error', error);
        res.status(500).json({ error: 'Internal server error' });
      });
  }
);
