import { z } from "zod";

// Match status constants
export const MATCH_STATUS = {
  SCHEDULED: "scheduled",
  LIVE: "live",
  FINISHED: "finished",
};

// Schema for list matches query parameters
export const listMatchesQuerySchema = z.object({
  limit: z.coerce.number().int().positive().max(100).optional(),
});

// Schema for match ID parameter
export const matchIdParamSchema = z.object({
  id: z.coerce
    .number()
    .int()
    .positive({ message: "Match ID must be a positive integer" }),
});

const isoDateString = z.string().refine((val) => !isNaN(Date.parse(val)), {
  message: "Must be a valid ISO date string",
});

// Schema for creating a match
export const createMatchSchema = z
  .object({
    sport: z
      .string()
      .min(1, { message: "sport is required and must be non-empty" }),
    homeTeam: z
      .string()
      .min(1, { message: "homeTeam is required and must be non-empty" }),
    awayTeam: z
      .string()
      .min(1, { message: "awayTeam is required and must be non-empty" }),
    startTime: isoDateString,
    endTime: isoDateString,
    homeScore: z.coerce.number().int().nonnegative().optional(),
    awayScore: z.coerce.number().int().nonnegative().optional(),
  })
  .superRefine((data, ctx) => {
    const startTime = new Date(data.startTime);
    const endTime = new Date(data.endTime);

    if (endTime <= startTime) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        path: ["endTime"],
        message: "endTime must be chronologically after startTime",
      });
    }
  });

// Schema for updating match score
export const updateScoreSchema = z.object({
  homeScore: z.coerce.number().int().nonnegative(),
  awayScore: z.coerce.number().int().nonnegative(),
});
