import { ExecutionContext, Injectable } from '@nestjs/common';
import { ThrottlerGuard } from '@nestjs/throttler';

import { throttler } from 'src/configs/throttler';

@Injectable()
export class IpThrottlerGuard extends ThrottlerGuard {
  private whitelist: string[] = throttler.whitelist ?? [];

  async canActivate(context: ExecutionContext) {
    // attempt to extract IP from request (works with express + proxies)
    const ctx = context.switchToHttp();
    const req = ctx.getRequest();

    let clientIp: string | undefined;
    try {
      const xff = req.headers?.['x-forwarded-for'];
      if (typeof xff === 'string' && xff.length) {
        clientIp = xff.split(',')[0].trim();
      } else if (req.ip) {
        clientIp = req.ip;
      } else if (req.connection && req.connection.remoteAddress) {
        clientIp = req.connection.remoteAddress;
      }
    } catch {
      // ignore
    }

    if (clientIp && this.whitelist.includes(clientIp)) {
      // bypass throttling for whitelisted IPs
      return true;
    }

    // not whitelisted -> use default behavior
    return super.canActivate(context);
  }
}
