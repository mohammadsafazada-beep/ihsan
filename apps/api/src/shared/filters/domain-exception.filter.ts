import { ArgumentsHost, Catch, ExceptionFilter, HttpStatus } from "@nestjs/common";
import { Response } from "express";
import { ConflictError, DomainError, NotFoundError, ValidationError } from "../errors/domain-errors";

function statusFor(error: DomainError): number {
  if (error instanceof NotFoundError) return HttpStatus.NOT_FOUND;
  if (error instanceof ValidationError) return HttpStatus.BAD_REQUEST;
  if (error instanceof ConflictError) return HttpStatus.CONFLICT;
  return HttpStatus.INTERNAL_SERVER_ERROR;
}

@Catch(DomainError)
export class DomainExceptionFilter implements ExceptionFilter {
  catch(error: DomainError, host: ArgumentsHost) {
    const response = host.switchToHttp().getResponse<Response>();
    const status = statusFor(error);
    response.status(status).json({
      error: {
        code: error.constructor.name,
        message: error.message,
      },
    });
  }
}
