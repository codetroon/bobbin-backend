import prisma from "../../../shared/prisma";

interface UpdateHeroSettingsPayload {
  title?: string;
  subtitle?: string;
  primaryBtnText?: string;
  primaryBtnLink?: string;
  secondaryBtnText?: string;
  secondaryBtnLink?: string;
  backgroundImage?: string;
  isActive?: boolean;
}

const getHeroSettings = async () => {
  // Get the active hero settings, or create default if none exists
  let heroSettings = await prisma.heroSettings.findFirst({
    where: { isActive: true },
    orderBy: { createdAt: "desc" },
  });

  // If no settings exist, create default
  if (!heroSettings) {
    heroSettings = await prisma.heroSettings.create({
      data: {
        title: "Elevate Your Style",
        subtitle:
          "Discover premium essentials crafted for the modern gentleman. Quality that speaks, comfort that lasts.",
        primaryBtnText: "Shop Now",
        primaryBtnLink: "/products",
        secondaryBtnText: "Learn More",
        secondaryBtnLink: "/about",
        isActive: true,
      },
    });
  }

  return heroSettings;
};

const updateHeroSettings = async (
  id: string,
  payload: UpdateHeroSettingsPayload,
) => {
  const result = await prisma.heroSettings.update({
    where: { id },
    data: payload,
  });

  return result;
};

export const HeroService = {
  getHeroSettings,
  updateHeroSettings,
};
