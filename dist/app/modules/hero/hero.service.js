"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.HeroService = void 0;
const prisma_1 = __importDefault(require("../../../shared/prisma"));
const getHeroSettings = () => __awaiter(void 0, void 0, void 0, function* () {
    // Get the active hero settings, or create default if none exists
    let heroSettings = yield prisma_1.default.heroSettings.findFirst({
        where: { isActive: true },
        orderBy: { createdAt: "desc" },
    });
    // If no settings exist, create default
    if (!heroSettings) {
        heroSettings = yield prisma_1.default.heroSettings.create({
            data: {
                title: "Elevate Your Style",
                subtitle: "Discover premium essentials crafted for the modern gentleman. Quality that speaks, comfort that lasts.",
                primaryBtnText: "Shop Now",
                primaryBtnLink: "/products",
                secondaryBtnText: "Learn More",
                secondaryBtnLink: "/about",
                isActive: true,
            },
        });
    }
    return heroSettings;
});
const updateHeroSettings = (id, payload) => __awaiter(void 0, void 0, void 0, function* () {
    const result = yield prisma_1.default.heroSettings.update({
        where: { id },
        data: payload,
    });
    return result;
});
exports.HeroService = {
    getHeroSettings,
    updateHeroSettings,
};
