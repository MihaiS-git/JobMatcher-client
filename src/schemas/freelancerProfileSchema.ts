import { z } from "zod";

const MAX_SKILLS = 1000;
const MAX_SOCIAL_LINKS = 5;
const MAX_CATEGORIES = 5;
const MAX_LANGUAGES = 5;

export const freelancerProfileSchema = z.object({
  username: z
    .string()
    .min(3, "Username must be at least 3 characters")
    .max(50, "Username must be at most 50 characters")
    .regex(/^[a-zA-Z0-9_-]+$/, "Username can only contain letters, numbers, underscores, and dashes"),

  headline: z
    .string()
    .min(2, "Headline must be at least 2 characters")
    .max(100, "Headline must be at most 100 characters")
    .optional(),

  hourlyRate: z
    .number()
    .min(0, "Hourly rate must be positive")
    .max(1000, "Hourly rate too high")
    .optional(),

  websiteUrl: z
    .url("Website URL must be valid")
    .optional()
    .or(z.literal("")),

  skills: z
  .string()
  .max(MAX_SKILLS, `Skills string is too long`)
  .optional(),

  jobSubcategoryIds: z
    .array(z.number())
    .max(MAX_CATEGORIES, `You can select up to ${MAX_CATEGORIES} categories only`)
    .optional(),

  experienceLevel: z.enum(["JUNIOR", "MID", "SENIOR"]),

  languageIds: z
    .array(z.number())
    .max(MAX_LANGUAGES, `You can select up to ${MAX_LANGUAGES} languages only`)
    .optional(),

  about: z
    .string()
    .max(1000, "About text is too long")
    .optional(),

  socialMedia: z
    .array(z.url("Social link must be a valid URL"))
    .max(MAX_SOCIAL_LINKS, `You can add up to ${MAX_SOCIAL_LINKS} social links only`)
    .optional(),

  availableForHire: z.boolean(),
});
