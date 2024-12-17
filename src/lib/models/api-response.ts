export const APIResponse = {
  Success: (data: Object) => Response.json(data, { status: 200 }),

  BadRequestError: (errors: { path: string; message: string }[]) =>
    Response.json({ errors }, { status: 400 }),

  UnauthorizedError: () =>
    Response.json({ message: "Invalid authorization token!" }, { status: 401 }),

  NotFoundError: (message: string) =>
    Response.json({ message }, { status: 404 }),

  InternalServerError: (message: string) =>
    Response.json({ message }, { status: 500 }),
};
