import { CanActivate, ExecutionContext, Injectable } from '@nestjs/common';
import { Request } from 'express';
import { Observable } from 'rxjs';
import { ConfigService } from '../../../config/services/config/config.service';

@Injectable()
export class AdminOnlyGuard implements CanActivate {
  constructor(private readonly configService: ConfigService) {}

  private readonly accessKey = this.configService.get('ACCESS_KEY');

  private readonly bearerTokenRegex = /^Bearer (.*)/;

  async canActivate(context: ExecutionContext) {
    // TODO: REMOVE
    return true;

    const request = context.switchToHttp().getRequest<Request>();
    const requestHeaders = request.headers;
    const requestAuthorizationHeader = requestHeaders.authorization || '';
    const bearerTokenRegexResult = this.bearerTokenRegex.exec(requestAuthorizationHeader);

    if (!bearerTokenRegexResult) {
      console.warn(
        `${request.ips} / ${request.ip} has tried to access admin only endpoint "${request.url}" with "${request.headers.authorization}" auth header`,
      );

      return false;
    }

    const bearerToken = bearerTokenRegexResult[1];

    return bearerToken === this.accessKey;
  }
}
