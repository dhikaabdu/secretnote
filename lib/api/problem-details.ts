export type ProblemStatus = 400 | 401 | 404 | 409 | 415 | 422 | 500;

export type ProblemValidationError = {
  path: string;
  message: string;
};

export const API_PRIVATE_HEADERS = {
  "Cache-Control": "private, no-store",
};

export function problemResponse(
  request: Request,
  status: ProblemStatus,
  title: string,
  detail: string,
  errors?: ProblemValidationError[],
): Response {
  return Response.json(
    {
      type: "about:blank",
      title,
      status,
      detail,
      instance: new URL(request.url).pathname,
      ...(errors ? { errors } : {}),
    },
    {
      status,
      headers: {
        ...API_PRIVATE_HEADERS,
        "Content-Type": "application/problem+json",
      },
    },
  );
}

export function validationProblem(
  request: Request,
  status: 400 | 422,
  title: string,
  detail: string,
  issues: Array<{ path: PropertyKey[]; message: string }>,
): Response {
  return problemResponse(
    request,
    status,
    title,
    detail,
    issues.map((issue) => ({
      path: issue.path.map(String).join("."),
      message: issue.message,
    })),
  );
}
