import { ApiError } from '../utils/ApiError.js';
export const validate = schema => (req, _res, next) => {
  const result = schema.safeParse({ body: req.body, params: req.params, query: req.query });
  if (!result.success) return next(new ApiError(400, 'Please check the submitted information.', result.error.issues.map(i => ({ path: i.path.join('.'), message: i.message }))));
  req.validated = result.data; next();
};
