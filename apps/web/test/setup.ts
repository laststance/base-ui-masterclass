/**
 * Global Vitest setup file.
 * Runs before every test suite to configure mocks and environment.
 *
 * @example
 * // Referenced in vitest.config.ts → test.setupFiles
 */

// Provide default env vars expected by application code
process.env.NEXT_PUBLIC_APP_URL = "http://localhost:3000";
process.env.AUTH_GITHUB_ID = "test-github-id";
process.env.AUTH_GITHUB_SECRET = "test-github-secret";
process.env.AUTH_GOOGLE_ID = "test-google-id";
process.env.AUTH_GOOGLE_SECRET = "test-google-secret";
process.env.LEMONSQUEEZY_WEBHOOK_SECRET = "test-webhook-secret";
process.env.LEMONSQUEEZY_PRODUCT_ID = "12345";
