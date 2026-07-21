import { Module } from "@nestjs/common";
import { APP_FILTER, APP_INTERCEPTOR } from "@nestjs/core";
import { PrismaModule } from "./shared/database/prisma.module";
import { DomainExceptionFilter } from "./shared/filters/domain-exception.filter";
import { ResponseEnvelopeInterceptor } from "./shared/interceptors/response-envelope.interceptor";
import { HealthModule } from "./modules/health/health.module";
import { UsersModule } from "./modules/users/users.module";
import { NutritionModule } from "./modules/nutrition/nutrition.module";

@Module({
  imports: [PrismaModule, HealthModule, UsersModule, NutritionModule],
  providers: [
    { provide: APP_FILTER, useClass: DomainExceptionFilter },
    { provide: APP_INTERCEPTOR, useClass: ResponseEnvelopeInterceptor },
  ],
})
export class AppModule {}
