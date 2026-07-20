export class DomainError extends Error {}

export class NotFoundError extends DomainError {
  constructor(entity: string, id: string) {
    super(`${entity} ${id} not found`);
  }
}

export class ValidationError extends DomainError {}

export class ConflictError extends DomainError {}
