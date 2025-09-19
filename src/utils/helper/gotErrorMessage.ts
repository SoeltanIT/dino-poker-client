export const getErrorMessage = (error: unknown) =>
  typeof error === "object" &&
  error !== null &&
  "message" in error &&
  typeof (error as any).message === "string"
    ? (error as any).message
    : null;
