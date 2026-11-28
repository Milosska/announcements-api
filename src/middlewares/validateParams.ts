import { z } from "zod";
import type { Request, Response, NextFunction } from "express";

const validateParams = (schema: z.ZodType) => {
  return (req: Request, res: Response, next: NextFunction) => {
    const result = schema.safeParse(req.params);
    if (!result.success) {
      return res.status(422).json({
        error: "Incorrect params format",
        details: result.error.issues,
      });
    }
    res.locals.params = result.data;
    next();
  };
};

export default validateParams;
