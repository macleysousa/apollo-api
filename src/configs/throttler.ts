import { ThrottlerModuleOptions } from '@nestjs/throttler';

const { THROTTLE_LIMIT, THROTTLE_TTL, THROTTLE_WHITELIST } = process.env;

// parse env values and provide a small helper `whitelist` array
//
// Usage:
//   THROTTLE_WHITELIST=127.0.0.1,10.0.0.0/8,::1,::ffff:127.0.0.1
// The guard will check the first IP in the X-Forwarded-For header or the request's
// remote address. Provide a comma-separated list of IPs (CIDR not supported by
// this simple implementation). Leading/trailing spaces are ignored.
const _whitelist = (THROTTLE_WHITELIST ?? '')
  .split(',')
  .map((s) => s.trim())
  .filter(Boolean);

const whitelist: string[] = [...(_whitelist ?? []), '::1', '::ffff:127.0.0.1'];

export const throttler = {
  throttlers: [
    { limit: Number(THROTTLE_LIMIT ?? 50), ttl: Number(THROTTLE_TTL ?? 1000) }, // 50 requests per second
  ],
  // custom property used by IpThrottlerGuard. Cast to allow extra property while keeping
  // original ThrottlerModuleOptions shape for compatibility.
  whitelist,
} as unknown as ThrottlerModuleOptions & { whitelist?: string[] };
