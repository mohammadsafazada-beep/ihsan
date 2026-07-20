import { ArgumentMetadata, PipeTransform } from "@nestjs/common";
import { ZodSchema } from "zod";
import { ValidationError } from "../errors/domain-errors";

export class ZodValidationPipe<T> implements PipeTransform {
  constructor(private readonly schema: ZodSchema<T>) {}

  transform(value: unknown, _metadata: ArgumentMetadata): T {
    const result = this.schema.safeParse(value);
    if (!result.success) {
      throw new ValidationError(result.error.issues.map((i) => i.message).join("; "));
    }
    return result.data;
  }
}
