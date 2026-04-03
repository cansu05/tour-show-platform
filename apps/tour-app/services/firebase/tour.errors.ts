export class TourDataAccessError extends Error {
  constructor(message: string, options?: {cause?: unknown}) {
    super(message, options);
    this.name = 'TourDataAccessError';
  }
}

export class TourValidationError extends Error {
  constructor(message: string) {
    super(message);
    this.name = 'TourValidationError';
  }
}

export class TourConflictError extends Error {
  constructor(message: string, options?: {cause?: unknown}) {
    super(message, options);
    this.name = 'TourConflictError';
  }
}
