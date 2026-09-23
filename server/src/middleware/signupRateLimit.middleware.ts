import { rateLimit } from "express-rate-limit";

export const signupRateLimit = rateLimit({
  windowMs: 15 * 60 * 1000,
  limit: 10,
  standardHeaders: "draft-8",
  legacyHeaders: false,
  message: {
    message:
      "Too many signup requests. Please try again later.",
  },
});