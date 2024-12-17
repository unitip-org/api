export const APIResponse = {
  respondWithSuccess: (data: Object) => Response.json(data, { status: 200 }),

  respondWithBadRequest: (errors: { path: string; message: string }[]) =>
    Response.json({ errors }, { status: 400 }),

  respondWithUnauthorized: () =>
    Response.json({ message: "Invalid authorization token!" }, { status: 401 }),

  respondWithNotFound: (message: string) =>
    Response.json({ message }, { status: 404 }),

  respondWithServerError: (message: string) =>
    Response.json({ message }, { status: 500 }),
};
