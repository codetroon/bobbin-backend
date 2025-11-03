import { z } from "zod";

const updateHeroSettings = z.object({
  body: z.object({
    title: z.string().optional(),
    subtitle: z.string().optional(),
    primaryBtnText: z.string().optional(),
    primaryBtnLink: z.string().optional(),
    secondaryBtnText: z.string().optional(),
    secondaryBtnLink: z.string().optional(),
    backgroundImage: z.string().optional(),
    isActive: z.boolean().optional(),
  }),
});

export const HeroValidation = {
  updateHeroSettings,
};
