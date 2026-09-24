import { AppError } from '../utils/AppError.js';

export const authorize = (...roles) => {
  return (req, res, next) => {
    if (!req.user || !roles.includes(req.user.role)) {
      return next(
        new AppError('Forbidden. You do not have permission to access this resource.', 403)
      );
    }
    next();
  };
};
