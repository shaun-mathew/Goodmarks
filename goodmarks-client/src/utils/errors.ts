export class ValidationError extends Error {
  validationErrors: string[];
  constructor(message: string, validationErrors: string[]) {
    super(message);
    this.name = "Validation Error";
    this.validationErrors = validationErrors;
  }
}

export class ServerError extends Error {
  constructor(message: string) {
    super(message);
    this.name = "Server Error";
  }
}

export class UnAuthenticatedError extends Error {
  constructor(message: string) {
    super(message);
    this.name = "Authentication Error";
  }
}
