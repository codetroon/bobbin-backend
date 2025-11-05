"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.HeroValidation = void 0;
const zod_1 = require("zod");
const updateHeroSettings = zod_1.z.object({
    body: zod_1.z.object({
        title: zod_1.z.string().optional(),
        subtitle: zod_1.z.string().optional(),
        primaryBtnText: zod_1.z.string().optional(),
        primaryBtnLink: zod_1.z.string().optional(),
        secondaryBtnText: zod_1.z.string().optional(),
        secondaryBtnLink: zod_1.z.string().optional(),
        backgroundImage: zod_1.z.string().optional(),
        isActive: zod_1.z.boolean().optional(),
    }),
});
exports.HeroValidation = {
    updateHeroSettings,
};
