import { CanActivate, ExecutionContext, Injectable } from "@nestjs/common";
import { Request } from "express";
import { GetCurrentUserUseCase } from "../../modules/users/application/use-cases/get-current-user.use-case";
import { UserEntity } from "../../modules/users/domain/entities/user.entity";

declare module "express" {
  interface Request {
    currentUser?: UserEntity;
  }
}

/** Runs after ClerkAuthGuard: resolves the verified Clerk claims into our internal User row. */
@Injectable()
export class ResolveCurrentUserGuard implements CanActivate {
  constructor(private readonly getCurrentUser: GetCurrentUserUseCase) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request = context.switchToHttp().getRequest<Request>();
    if (!request.auth) {
      throw new Error("ResolveCurrentUserGuard used without ClerkAuthGuard running first");
    }
    request.currentUser = await this.getCurrentUser.execute(request.auth.clerkId);
    return true;
  }
}
