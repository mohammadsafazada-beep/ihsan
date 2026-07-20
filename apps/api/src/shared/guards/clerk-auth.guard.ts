import { CanActivate, ExecutionContext, Injectable, UnauthorizedException } from "@nestjs/common";
import { verifyToken } from "@clerk/backend";
import { Request } from "express";

export interface AuthContext {
  clerkId: string;
}

declare module "express" {
  interface Request {
    auth?: AuthContext;
  }
}

@Injectable()
export class ClerkAuthGuard implements CanActivate {
  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request = context.switchToHttp().getRequest<Request>();
    const token = request.headers.authorization?.replace(/^Bearer\s+/i, "");

    if (!token) {
      throw new UnauthorizedException("Missing bearer token");
    }

    const secretKey = process.env.CLERK_SECRET_KEY;
    if (!secretKey) {
      throw new Error("CLERK_SECRET_KEY is not configured");
    }

    try {
      const claims = await verifyToken(token, { secretKey });
      request.auth = { clerkId: claims.sub };
      return true;
    } catch {
      throw new UnauthorizedException("Invalid session token");
    }
  }
}
