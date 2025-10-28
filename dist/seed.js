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
const client_1 = require("@prisma/client");
const bcrypt_1 = __importDefault(require("bcrypt"));
const prisma = new client_1.PrismaClient();
function main() {
    return __awaiter(this, void 0, void 0, function* () {
        // Check if admin user already exists
        const existingAdmin = yield prisma.user.findUnique({
            where: { email: "admin@bobbin.com" },
        });
        if (!existingAdmin) {
            // Create default admin user
            const hashedPassword = yield bcrypt_1.default.hash("admin123", 12);
            yield prisma.user.create({
                data: {
                    name: "Admin User",
                    email: "admin@bobbin.com",
                    password: hashedPassword,
                    role: "super_admin",
                },
            });
            console.log("Default admin user created:");
            console.log("Email: admin@bobbin.com");
            console.log("Password: admin123");
        }
        else {
            console.log("Admin user already exists");
        }
        // Create sample categories if none exist
        const categoryCount = yield prisma.category.count();
        if (categoryCount === 0) {
            yield prisma.category.createMany({
                data: [
                    { name: "T-Shirts" },
                    { name: "Punjabi" },
                    { name: "Joggers" },
                    { name: "Hoodies" },
                    { name: "Casual Wear" },
                    { name: "Formal Wear" },
                ],
            });
            console.log("Sample categories created");
        }
    });
}
main()
    .catch((e) => {
    console.error(e);
    process.exit(1);
})
    .finally(() => __awaiter(void 0, void 0, void 0, function* () {
    yield prisma.$disconnect();
}));
