import {
  Injectable,
  CanActivate,
  ExecutionContext,
  Session,
  Req,
} from '@nestjs/common';
import { Request } from 'express';
import session from 'express-session';
import { Observable } from 'rxjs';
import { SessionType } from 'src/session';

@Injectable()
export class AuthGuard implements CanActivate {
  canActivate(
    context: ExecutionContext,
  ): boolean | Promise<boolean> | Observable<boolean> {
    const request = context.switchToHttp().getRequest();
    return validateRequest(request);
  }
}

function validateRequest(req: { session: any; user_id: any }): boolean {
  const session = req.session;
  console.log({ session });

  //   if (session && session.user_id) {
  //     return true;
  //   }

  //   return false;

  return session && session.user_id;
}
