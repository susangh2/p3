import { Injectable, UnauthorizedException } from '@nestjs/common';
import { AuthGuard as PassportAuthGuard } from '@nestjs/passport';

@Injectable()
export class GoogleGuard extends PassportAuthGuard('google') {
  handleRequest(err: any, user: any): any {
    if (err || !user) {
      throw new UnauthorizedException();
    }
    return user;
  }
}
