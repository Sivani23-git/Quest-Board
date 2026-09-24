import { AppError } from '../utils/AppError.js';

export const validate = (schema) => (req, res, next) => {
  const { error } = schema.validate(req.body, {
    abortEarly: false,
    allowUnknown: false,
    stripUnknown: true,
  });

  if (error) {
    const errorMessages = error.details.map((detail) => detail.message).join(', ');
    return next(new AppError(errorMessages, 400));
  }

  next();
};
