import { createParamDecorator, ExecutionContext } from "@nestjs/common";
import { Request } from "express";
import { AuthContext } from "../guards/clerk-auth.guard";
import { UserEntity } from "../../modules/users/domain/entities/user.entity";

/** Resolves to the verified Clerk claims attached by ClerkAuthGuard, not the internal User row. */
export const CurrentAuth = createParamDecorator((_data: unknown, ctx: ExecutionContext): AuthContext => {
  const request = ctx.switchToHttp().getRequest<Request>();
  if (!request.auth) {
    throw new Error("CurrentAuth used outside a route protected by ClerkAuthGuard");
  }
  return request.auth;
});

/** Resolves to the internal User row. Requires ClerkAuthGuard + ResolveCurrentUserGuard on the route. */
export const CurrentUser = createParamDecorator((_data: unknown, ctx: ExecutionContext): UserEntity => {
  const request = ctx.switchToHttp().getRequest<Request>();
  if (!request.currentUser) {
    throw new Error("CurrentUser used outside a route protected by ResolveCurrentUserGuard");
  }
  return request.currentUser;
});
