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
var __rest = (this && this.__rest) || function (s, e) {
    var t = {};
    for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p) && e.indexOf(p) < 0)
        t[p] = s[p];
    if (s != null && typeof Object.getOwnPropertySymbols === "function")
        for (var i = 0, p = Object.getOwnPropertySymbols(s); i < p.length; i++) {
            if (e.indexOf(p[i]) < 0 && Object.prototype.propertyIsEnumerable.call(s, p[i]))
                t[p[i]] = s[p[i]];
        }
    return t;
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.PartService = void 0;
const http_status_1 = __importDefault(require("http-status"));
const ApiError_1 = __importDefault(require("../../../errors/ApiError"));
const paginationHelper_1 = require("../../../helpers/paginationHelper");
const prisma_1 = __importDefault(require("../../../shared/prisma"));
const part_constant_1 = require("./part.constant");
// add to part to db
const addPart = (userId, partData) => __awaiter(void 0, void 0, void 0, function* () {
    var _a;
    const { title, description, categoryId, subCategoryId, brandId, vehicleModelId, price, stock, condition, compatibility, images, documents, variants, } = partData;
    // check if seller exists
    const findSeller = yield prisma_1.default.user.findUnique({
        where: { id: userId },
        include: { sellerProfile: true },
    });
    if (!findSeller || !((_a = findSeller.sellerProfile) === null || _a === void 0 ? void 0 : _a.id)) {
        throw new ApiError_1.default(http_status_1.default.NOT_FOUND, "Seller profile not found");
    }
    // Create the part
    const part = yield prisma_1.default.part.create({
        data: {
            sellerId: findSeller.sellerProfile.id,
            title,
            description,
            categoryId,
            subCategoryId,
            brandId,
            vehicleModelId,
            price,
            stock,
            condition,
            compatibility,
            images,
            documents,
        },
    });
    // handle dynamic variants
    yield Promise.all(Object.entries(variants).map((_a) => __awaiter(void 0, [_a], void 0, function* ([typeName, values]) {
        const variantType = yield prisma_1.default.variantType.upsert({
            where: { name: typeName },
            update: {},
            create: { name: typeName },
        });
        yield Promise.all(values.map((value) => __awaiter(void 0, void 0, void 0, function* () {
            const variantValue = yield prisma_1.default.variantValue.upsert({
                where: {
                    variant_type_value_unique: {
                        variantTypeId: variantType.id,
                        value,
                    },
                },
                update: {},
                create: {
                    value,
                    variantTypeId: variantType.id,
                },
            });
            yield prisma_1.default.partVariant.create({
                data: {
                    partId: part.id,
                    variantTypeId: variantType.id,
                    variantValueId: variantValue.id,
                },
            });
        })));
    })));
    // return the full part with variants
    return prisma_1.default.part.findUnique({
        where: { id: part.id },
        include: {
            PartVariant: {
                include: {
                    variantType: true,
                    variantValue: true,
                },
            },
        },
    });
});
// get all parts
const getAllParts = (filters, options) => __awaiter(void 0, void 0, void 0, function* () {
    const { page, limit, skip, sortBy, sortOrder } = paginationHelper_1.paginationHelpers.calculatePagination(options);
    const { searchTerm, minPrice, maxPrice } = filters, filterData = __rest(filters, ["searchTerm", "minPrice", "maxPrice"]);
    const andConditions = [];
    // search
    if (searchTerm) {
        andConditions.push({
            OR: part_constant_1.partSearchFields.map((field) => ({
                [field]: {
                    contains: searchTerm,
                    mode: "insensitive",
                },
            })),
        });
    }
    // filter
    if (Object.keys(filterData).length) {
        andConditions.push({
            AND: Object.entries(filterData).map(([field, value]) => {
                const stringFields = ["condition", "title"];
                if (stringFields.includes(field) && typeof value === "string") {
                    return {
                        [field]: {
                            equals: value,
                            mode: "insensitive",
                        },
                    };
                }
                return {
                    [field]: value,
                };
            }),
        });
    }
    // price filtering
    if (minPrice !== undefined || maxPrice !== undefined) {
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        const priceCondition = {};
        if (minPrice !== undefined)
            priceCondition.gte = minPrice;
        if (maxPrice !== undefined)
            priceCondition.lte = maxPrice;
        andConditions.push({
            price: priceCondition,
        });
    }
    const whereConditions = andConditions.length > 0 ? { AND: andConditions } : {};
    const result = yield prisma_1.default.part.findMany({
        where: whereConditions,
        include: {
            category: true,
            subCategory: true,
            brand: true,
            vehicleModel: true,
            PartVariant: {
                include: {
                    variantType: true,
                    variantValue: true,
                },
            },
        },
        skip,
        take: limit,
        orderBy: sortBy && sortOrder
            ? { [sortBy]: sortOrder }
            : {
                createdAt: "desc",
            },
    });
    const total = yield prisma_1.default.part.count({
        where: whereConditions,
    });
    return {
        meta: {
            total,
            page,
            limit,
        },
        data: result,
    };
});
// get single part
const getSinglePart = (partId, userId) => __awaiter(void 0, void 0, void 0, function* () {
    const findUser = yield prisma_1.default.user.findUnique({
        where: { id: userId },
    });
    if (!findUser) {
        throw new ApiError_1.default(http_status_1.default.NOT_FOUND, "User not found");
    }
    const part = yield prisma_1.default.part.findUnique({ where: { id: partId } });
    return part;
});
// update part details (seller only)
const updatePart = (userId, partId, updateData) => __awaiter(void 0, void 0, void 0, function* () {
    var _a;
    const findUser = yield prisma_1.default.user.findUnique({
        where: { id: userId },
        include: { sellerProfile: true },
    });
    const existing = yield prisma_1.default.part.findUnique({ where: { id: partId } });
    if (!existing) {
        throw new ApiError_1.default(http_status_1.default.NOT_FOUND, "Part not found");
    }
    if (existing.sellerId !== ((_a = findUser === null || findUser === void 0 ? void 0 : findUser.sellerProfile) === null || _a === void 0 ? void 0 : _a.id)) {
        throw new ApiError_1.default(http_status_1.default.FORBIDDEN, "You can only update your own parts");
    }
    return yield prisma_1.default.part.update({
        where: { id: partId },
        data: updateData,
    });
});
// delete part (admin and seller only)
const deletePart = (userId, role, partId) => __awaiter(void 0, void 0, void 0, function* () {
    var _a;
    const findUser = yield prisma_1.default.user.findUnique({
        where: { id: userId },
        include: { sellerProfile: true },
    });
    const part = yield prisma_1.default.part.findUnique({ where: { id: partId } });
    if (!part) {
        throw new ApiError_1.default(http_status_1.default.NOT_FOUND, "Part not found");
    }
    if (role !== "admin" &&
        role !== "seller" &&
        part.sellerId !== ((_a = findUser === null || findUser === void 0 ? void 0 : findUser.sellerProfile) === null || _a === void 0 ? void 0 : _a.id)) {
        throw new ApiError_1.default(http_status_1.default.FORBIDDEN, "You can only delete your own parts");
    }
    return yield prisma_1.default.part.update({
        where: { id: partId },
        data: { isDeleted: true },
    });
});
exports.PartService = {
    addPart,
    getAllParts,
    getSinglePart,
    updatePart,
    deletePart,
};
