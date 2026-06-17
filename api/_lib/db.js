const { Redis } = require('@upstash/redis');

// Vercel's storage integrations have changed naming a few times
// (native "Vercel KV" -> Upstash Marketplace integration). Support
// whichever pair of env vars actually got created, so this keeps
// working regardless of which option was clicked in the dashboard.
const CREDENTIAL_PAIRS = [
  ['KV_REST_API_URL', 'KV_REST_API_TOKEN'],
  ['UPSTASH_REDIS_REST_URL', 'UPSTASH_REDIS_REST_TOKEN'],
  ['REDIS_REST_URL', 'REDIS_REST_TOKEN']
];

function resolveCredentials() {
  for (const [urlKey, tokenKey] of CREDENTIAL_PAIRS) {
    const url = process.env[urlKey];
    const token = process.env[tokenKey];
    if (url && token) {
      return { url, token };
    }
  }
  return null;
}

let client = null;

function getClient() {
  if (client) return client;
  const creds = resolveCredentials();
  if (!creds) {
    const checked = CREDENTIAL_PAIRS.map(p => p.join('/')).join(', ');
    throw new Error(
      `No Redis credentials found in environment variables. Checked: ${checked}. ` +
      `Make sure a Redis/Upstash database is connected to this project in Vercel's Storage tab, then redeploy.`
    );
  }
  client = new Redis({ url: creds.url, token: creds.token });
  return client;
}

const kv = {
  async get(key) {
    return await getClient().get(key);
  },
  async set(key, value) {
    return await getClient().set(key, value);
  }
};

module.exports = { kv };
