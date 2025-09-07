"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.nextjsFunc = void 0;
const v2_1 = require("firebase-functions/v2");
const https_1 = require("firebase-functions/v2/https");
const next_1 = __importDefault(require("next"));
const path_1 = __importDefault(require("path"));
// Set global options for all functions
(0, v2_1.setGlobalOptions)({
    maxInstances: 10,
    memory: '1GiB',
    timeoutSeconds: 60,
    region: 'us-central1',
});
// Initialize Next.js app
const nextApp = (0, next_1.default)({
    dev: false,
    conf: {
        distDir: path_1.default.join(__dirname, '../../.next'),
        experimental: {
            serverComponentsExternalPackages: ['firebase-admin'],
        },
    },
});
const nextjsHandler = nextApp.getRequestHandler();
// Export the Next.js app as a Cloud Function
exports.nextjsFunc = (0, https_1.onRequest)({
    region: 'us-central1',
    memory: '1GiB',
    timeoutSeconds: 60,
    maxInstances: 10,
}, async (req, res) => {
    return nextApp.prepare().then(() => {
        return nextjsHandler(req, res);
    });
});
//# sourceMappingURL=index.js.map